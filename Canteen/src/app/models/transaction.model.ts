export class Transaction {
    orderId: number;
    orderStamp: string;
    cost: number;
    status: string;
  
    constructor(data: Partial<Transaction> = {}) {
      this.orderId = data.orderId || 0;
      this.orderStamp = data.orderStamp || "";
      this.cost = data.cost || 0;
      this.status = data.status || "";
    }
  }
  