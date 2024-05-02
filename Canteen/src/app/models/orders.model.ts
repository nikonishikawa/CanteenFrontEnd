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
    foodImage: string;
}

export interface orders {
  category: number;
  description: string;
  foodImage: string;
  isHalal: number; 
  item: string;
  itemId: number; 
  price: number; 
}
// this.orderItems.Item
// this.orderItems.Quantity