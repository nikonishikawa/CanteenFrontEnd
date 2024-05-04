import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../../services/menu.service';
import { Menu } from '../../../models/menu.model';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { addMenu } from '../../../models/manage-menu.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-menu.component.html',
  styleUrl: './manage-menu.component.css'
})


export class ManageMenuComponent implements OnInit {
  menus: Menu[] = [];
  category: Category[] = [];
  filteredMenu: { [key: number]: Menu[] } = {};
  trayItems: any[] = [];
  trayTempId: string | null = null; 
  selectedCategory: number = 0;
  groupedMenu: { [key: string]: Menu[] } = {};
  filterSelected: any = null;
  activeIndex: number = 0;
  modalOpen: boolean = false;
  addMenu: addMenu = {} as addMenu;
  getCategoryByName: {categoryId: number; category: string} [] = [];

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private router: Router
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
          console.log(this.menus);
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
          console.log(res.data);
          this.category = res.data;
          this.filterMenu(0);
        }
      },
      error: (error) => {
      }
    });
  }

  filtSelect(index: number) {
    this.filterSelected = index === 0 ? index : (index === this.filterSelected ? 1 : index);
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

    // console.log('Filtered Menu:', this.filteredMenu);
    // console.log('All Menus:', this.menus);
    // console.log('Unique Categories:', uniqueCategories);
  }

  getCategoryName(categoryId: any): any {
    console.log(categoryId);
    const categoryIdNumber = parseInt(categoryId, 10);
    const correspondingCategory = this.category.find(cat => cat.categoryId === categoryIdNumber);
    
    console.log(categoryIdNumber, correspondingCategory);
    return correspondingCategory ? correspondingCategory.category : categoryId;
  }


  getAllMenus() {
    this.menuService.getAllMenu().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.menus = res.data;
          console.log("Response", res);

          if (this.menus && this.menus.length > 0) {
            this.menus.forEach(menuItem => {
              if (menuItem && menuItem) {
                console.log("Item ID:", menuItem.itemId);
                console.log("Item:", menuItem.item);
                console.log("Description:", menuItem.description);
                console.log("Is Halal:", menuItem.isHalal);
                console.log("Price:", menuItem.price);
                console.log("Category:", menuItem.category);
              } else {
                console.error("Menu item or its data is undefined:", menuItem);
              }
            });
          } else {
            console.error("Menus array is empty or undefined");
          }
        } else {
          console.error('Error retrieving menus:', res.message);
        }
      }
    );
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