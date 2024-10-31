import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'wallets',
  timestamps: true,
})
export class Wallet extends Model<Wallet> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  })
  id: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  balance: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currency: string;
}
