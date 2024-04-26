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
  OrderItem: number;
  OrderID: number;
  Item: number;
  Quantity: number;
  Price: number;
  CusID: number;
  OrderStamp: string;
  Cost: number;
  ModeOfPayment: number;
  Status: number;
}