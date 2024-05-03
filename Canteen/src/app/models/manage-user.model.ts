export interface getAllUser {
    customerId: number;
    cusCredentials: string;
    cusName: number;
    cusAddress: number;
    membership: number;
    status: number;
    customerName?: string;
  }

  export interface userName {
    firstName: string;
    middleName: string;
    lastName: string;
  }

  export interface Membership {
    memberShipId: number;
    membership: string;
    loyaltyPoints: number;
    status: string;
  }

  export interface genAddress {
    genAddressId: number;
    addressId: string;
    email: string;
    contactNumber: string;
  }

  export interface userStatus {
    userStatusId: number;
    status: string;
  }

  export interface Address {
    addressId: number;
    barangay: string;
    region: string;
    postalCode: string;
  }

  export interface editUser {
    firstName: string;
    middleName: string;
    lastName: string;
    membership: string;
    address: string;
    status: string;
  }
