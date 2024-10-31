import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { WalletService } from 'src/wallets/wallets.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user.get();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(email: string, name: string, password: string): Promise<{ user: User; accessToken: string }> {
    try {
      const user = new User({ email, name, password });
      await user.hashPassword();
      const savedUser = await user.save();

      await this.walletService.createWallet(savedUser.id);

      const payload = { email: savedUser.email, sub: savedUser.id };
      const accessToken = this.jwtService.sign(payload);

      return {
        user: savedUser,
        accessToken,
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Could not create user');
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
