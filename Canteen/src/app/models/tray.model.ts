export interface TrayItem {
    item: number; 
    quantity: number;
    addStamp: Date;
    
  }
  
  export interface TrayCombinedDto {
    cusId: number;
    status: number;
    trayTempId: number;
    items: TrayItem[];
  }
  
  export interface OrderDTO {
    subTotal: number;
    discount: number;
    Cost: number;
  }
  
  
export interface Tray {
    trayTempId: string;
  }
  
  
export interface TrayItemsDTO {
    item: string;
    foodImage: string;
    price: number;
    quantity: number;
  }

export interface SelectedCatDTO {
    selectedCategory: number;
  }
  
export interface TrayItemsResponse {
    data: TrayItem[]; 
  }
  
export interface TrayItem {
    trayTempId: number;
    trayItemTempId: number;
  }
  
  export interface CustomerDto {
    customerId: number;
  }

  export interface TrayItemDTO {
    trayItemTempId: number;
    trayTempId: number;
    item: number;
    quantity: number;
    addStamp: string; 
  }