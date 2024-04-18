export class Quantity {
    trayItemTempID: number;
    quantity: number;
   
  
    constructor(data: Partial<Quantity> = {}) {
      this.trayItemTempID = data.trayItemTempID || 0;
      this.quantity = data.quantity || 0;
   
    }
  }
  