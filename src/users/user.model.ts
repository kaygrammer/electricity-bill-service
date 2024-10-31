// src/users/user.model.ts
import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Bill } from '../bills/bill.model';
import { Wallet } from '../wallets/wallet.model';
import * as bcrypt from 'bcrypt';
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
    return bcrypt.compare(password, this.password);
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}