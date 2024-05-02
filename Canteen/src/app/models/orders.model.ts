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
  orderItemId: number;
  orderId: number;
  item: number;
  quantity: number;
  price: number;
  orderStamp: string;
  cost: number;
  modeOfPayment: number;
  status: number;
}

// this.orderItems.Item
// this.orderItems.Quantity