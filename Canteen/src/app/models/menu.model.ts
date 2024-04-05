export class Menu {
  itemId: number;
  item: string;
  description: string;
  foodImage: string; // Rename this property to match the DTO
  isHalal: number;
  price: number;
  category: number;

  constructor(data: Partial<Menu> = {}) {
    this.itemId = data.itemId || 0;
    this.item = data.item || "";
    this.description = data.description || "";
    this.foodImage = data.foodImage || ""; // Update property name
    this.isHalal = data.isHalal || 0;
    this.price = data.price || 0;
    this.category = data.category || 0;
  }
}
