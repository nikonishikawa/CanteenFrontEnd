export interface UserStatus {
    userStatusId: number;
    Status: string;
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
  }