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
    cusId: number;
    item: string;
    quantity: number;
    price: number;
    orderStamp: string; 
    cost: number;
    modeOfPayment: string; 
    status:  string; 
    statusName: string;
    foodImage: string;
    name: number;
    firstName: string;
    itemCategoryName: string;
    modeOfPaymentName: string;
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

export interface status {
  statusId: number;
  status: string;
}

export interface UserOrderData {
  orderId: number;
  totalPrice: number;
  items: {
    itemName: string;
    price: number;
    foodImage: string;
    quantity: number;
    orderId: number;
  }[];
}