export interface UserStatus {
    userStatusId: number;
    status: string;
  }

export interface Membership {
    memberShipId: number;
    membership: string;
    loyaltyPoints: number;
    Status: string;
  }

  export interface TotalRev {
    orderCompletedId: number;
    quantity: number;
    price: number;
    category: string;
    itemName: string;
    stocks: number;
    completedStamp: string;
    totalSales: number;
  }

  export interface SalesData {
    [itemName: string]: {
      name: string;
      price: number;
      quantitySold: number;
    };
  }

  export interface SalesProductDTO {
    name: string;
    price: number;
    quantitySold: number;
  }