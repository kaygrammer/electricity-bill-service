import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Bill } from '../bills/bill.model';
import { Wallet } from '../wallets/wallet.model';
import { hashPassword, validatePassword } from 'src/common/password.utils';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Bill)
  bills: Bill[];

  @HasMany(() => Wallet)
  wallets: Wallet[];

  async validatePassword(password: string): Promise<boolean> {
    return validatePassword(password, this.password);
  }

  async hashPassword() {
    this.password = await hashPassword(this.password);
  }
}
