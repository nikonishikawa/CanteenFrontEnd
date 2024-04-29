export interface Customer {
  customerId: number;
  cusCredentials: string;
  cusName: number; 
  cusAddress: number; 
  membership: number; 
  status: number;
}

export interface CustomerName {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface customerGeneralAddress {
  addressId: number;
  email: string;
  contactNumber: string;
}

export interface address {
  barangay: string;
  region: string;
  postalCode: number;
}