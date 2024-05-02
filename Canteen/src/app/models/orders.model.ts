export interface MOP {
    modeOfPaymentId: number; 
    modeOfPayment: string;
  }

  export interface trayItemTest {
    item: number; 
    foodImage: string;
    price: number;
    quantity: number;
    trayItemTempId: number;
    trayTempId: number;
  }

  export interface orderItems {
    orderId: number;
    orderItemId: number;
    item: string;
    quantity: number;
    price: number;
    orderStamp: string; 
    cost: number;
    modeOfPayment: string; 
    status:  string; 
  }
  

// this.orderItems.Item
// this.orderItems.Quantity