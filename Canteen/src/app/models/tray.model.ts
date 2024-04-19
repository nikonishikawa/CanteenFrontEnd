export interface TrayItem {
  trayItemTempID: number;
  trayTempID: number;
  item: number;
  quantity: number;
  addStamp: string;
}

export interface TrayItemsDTO {
  trayItems: TrayItem[];
}