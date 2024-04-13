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
  