export interface Menu {
  itemId: number;
  item: string;
  description: string;
  foodImage: string; 
  stock: number;
  isHalal: number;
  price: number;
  category: number;
  categoryName: string;
}

export interface Order {
  orderCompletedId: number;
  orderId: number;
  itemId: number;
  cusId: number;
  itemName: string;
  completedStamp: string;
  quantity: number;
  price: number;
  foodImage: string;
  orderStamp: string;
}