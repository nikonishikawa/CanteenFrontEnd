import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../../services/menu.service';
import { Menu } from '../../../models/menu.model';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { addMenu } from '../../../models/manage-menu.model';
import { FormsModule } from '@angular/forms';
import { ManageMenuService } from '../../../services/manage-menu.service';

@Component({
  selector: 'app-vendor-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-menu.component.html',
  styleUrl: './vendor-menu.component.css'
})
export class VendorMenuComponent implements OnInit {
  menus: Menu[] = [];
  category: Category[] = [];
  filteredMenu: { [key: number]: Menu[] } = {};
  trayItems: any[] = [];
  trayTempId: string | null = null; 
  selectedCategory: number = 0;
  groupedMenu: { [key: string]: Menu[] } = {};
  filterSelected: number = 0;
  activeIndex: number = 0;
  newStockValues: { [itemId: number]: number } = {};
  modalOpen: boolean = false;
  addMenu: addMenu = {} as addMenu;
  getCategoryByName: {categoryId: number; category: string} [] = [];

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private router: Router,
    private manageMenuService: ManageMenuService
  ) { }

  ngOnInit(): void {
    this.loadMenu(); 

  }

  openModal() {
    this.modalOpen = true;
  }
  closeModal() {
    this.modalOpen = false;
  }

  submitMenu() {
    this.manageMenuService.addMenu(
      this.addMenu.item,
      this.addMenu.description,
      this.addMenu.foodImage,
      this.addMenu.isHalal,
      this.addMenu.price,
      this.addMenu.stocks,
      this.addMenu.category,
      this.getCategoryName(this.addMenu.category)
    ).subscribe(
      response => {
        this.toastr.success("Added Item Successfully!");
        this.loadMenu(); 
      },
      error => {
        console.error(error);
      }
    );
    this.closeModal(); 
  }

  updateHalalValue(event: any) {
    this.addMenu.isHalal = event.target.checked ? 1 : 0;
  }

  AddMenu(addMenu: addMenu) {
    this.addMenu = { 
      itemId: addMenu.itemId,
      item: addMenu.item,
      description: addMenu.description,
      foodImage: addMenu.foodImage,
      isHalal: addMenu.isHalal,
      price: addMenu.price,
      stocks: addMenu.stocks,
      category: addMenu.category
    };
    this.openModal(); 
  }
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.addMenu.foodImage = reader.result as string;
    };
  }
  

  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.menus = res.data;
          this.loadCategory();
          this.groupedMenu = this.groupByCategory(this.menus);
        }
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
  }
  
  loadCategory() {
    this.menuService.getAllCaetegory().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.category = res.data;
          this.filterMenu(0);
        }
      },
      error: (error) => {
      }
    });
  }

  filtSelect(index: number) {
    this.filterSelected = index;
    this.setActiveIndex(this.filterSelected);  
  }

  setActiveIndex(index: any | 0) {
    this.activeIndex = index;
  }

  getActiveIndex() {
    return this.activeIndex;
  }
  
  filterMenu(categoryId: any) {
    this.filtSelect(categoryId);
    const uniqueCategories = [...new Set(this.menus.map(menu => menu.category))];
    this.category = this.category.filter(cat => uniqueCategories.includes(cat.categoryId));
    this.selectedCategory = categoryId; 

    if (this.selectedCategory === 0) {
      this.filteredMenu = this.groupByCategory(this.menus); 
    } else {
      const filteredMenus = this.menus.filter(menu => menu.category === this.selectedCategory);
      this.filteredMenu = this.groupByCategory(filteredMenus);
    }
  }

  updateStock(itemId: number) {
    const newStockValue = this.newStockValues[itemId]; 
    if (newStockValue === undefined || newStockValue === null) {
      return;
    }

    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
        delete this.newStockValues[itemId];
      },
      error => {
        console.error(error); 
      }
    );
  }

  updateStockToZero(itemId: number) {
    this.manageMenuService.updateItemStock(itemId, 0).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }

  increaseStockBy1(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = currentStock + 1;
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  
  increaseStockBy5(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = currentStock + 5;
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  

  increaseStockBy10(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = currentStock + 10;
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  
  decreaseStockBy1(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = Math.max(0, currentStock - 1); 
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  
  decreaseStockBy5(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = Math.max(0, currentStock - 5); 
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  
  decreaseStockBy10(itemId: number) {
    let currentStock = parseInt(localStorage.getItem(`stock_${itemId}`) || '0');
    const newStockValue = Math.max(0, currentStock - 10);
    localStorage.setItem(`stock_${itemId}`, newStockValue.toString());
  
    this.manageMenuService.updateItemStock(itemId, newStockValue).subscribe(
      response => {
        this.loadMenu();
      },
      error => {
        console.error(error);
      }
    );
  }
  
 
  getCategoryName(categoryId: any): any {
    const categoryIdNumber = parseInt(categoryId, 10);
    const correspondingCategory = this.category.find(cat => cat.categoryId === categoryIdNumber);
    return correspondingCategory ? correspondingCategory.category : categoryId;
  }

  groupByCategory(menuItems: Menu[]): { [key: string]: Menu[] } {
    return menuItems.reduce((result: { [key: string]: Menu[] }, menuItem) => {
      const categoryName = this.getCategoryName(menuItem.category);
      (result[categoryName] = result[categoryName] || []).push(menuItem);
      return result;
    }, {});
  }

  getCategory(categoryId: number): string {
    const cat = this.getCategoryByName.find(x => x.categoryId === categoryId)
    return cat ? cat.category : '';
  }
}