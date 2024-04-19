export interface OrderDTO {
    subTotal: number;
    discount: number;
    total: number;
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
  }
  