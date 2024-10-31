export class BillPaidEvent {
  constructor(
    public readonly billId: string,
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
