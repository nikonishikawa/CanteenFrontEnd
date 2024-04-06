export class Customer { 
  customerId: number;
  cusCredentials: string;
  cusName: number; 
  cusAddress: number; 
  membership: number; 
  status: number;
    
  constructor(data: Partial<Customer> = {}) {
    this.customerId = data.customerId || 0;
    this.cusCredentials = data.cusCredentials || '';
    this.cusName = data.cusName || 0; 
    this.cusAddress = data.cusAddress || 0; 
    this.membership = data.membership || 0; 
    this.status = data.status || 0;
  }
}
  