// import { Controller, Post, Body } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from './user.model';
// import { RegisterUserDto } from './dto/register-user.dto';

// @Controller('auth')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post('register')
//   async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
//     const { email, name, password } = registerUserDto;
//     return this.usersService.register(email, name, password);
//   }
// }
