import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'bills',
  timestamps: true,
})
export class Bill extends Model<Bill> {
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
  })
  amount: number;

  @Column({
    type: DataType.ENUM('Pending', 'Paid'),
    allowNull: false,
  })
  status: 'Pending' | 'Paid';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  meterNumber: string;

  @Column({
    type: DataType.ENUM('A', 'B'),
    allowNull: false,
  })
  provider: 'A' | 'B';

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
