import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Menu } from '../../../models/menu.model';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/user.model';
import { Category } from '../../../models/category.model';
import { CustomerDto, OrderDTO, Tray, TrayItem } from '../../../models/tray.model';
import { MOP, trayItemTest } from '../../../models/orders.model';
import { switchMap, throwError } from 'rxjs';
import { NgPipesModule } from 'ngx-pipes';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule, NgPipesModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})

export class MenuComponent implements OnInit {
  customer: CustomerDto = {} as CustomerDto;
  menus: Menu[] = [];
  category: Category[] = [];
  filteredMenu: { [key: number]: Menu[] } = {};
  trayitemtest: trayItemTest[] = [];
  trayItems: any[] = [];
  trayTempId: string | null = null; 
  order: OrderDTO = {} as OrderDTO;
  tray: Tray = {} as Tray;
  mop: MOP[] = [];
  modeOfPaymentId: number = 0;
  OrderID: number = 0;
  selectedCategory: number = 0;
  groupedMenu: { [key: string]: Menu[] } = {};
  filterSelected: number = 0;
  activeIndex: number = 0;


  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadCustomerData();
    this.loadMenu(); 
  }
  
  loadCustomerData(): void {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res.data.customerId);
        this.customer.customerId = res.data.customerId;
        this.generateTrayTempId();
       
      },
      error: (error) => {
        console.error('Error loading customer data:', error);
      }
    });
  }
  
  generateTrayTempId() {
    this.trayTempId = localStorage.getItem('trayTempId');
    if (!this.trayTempId) {
      this.menuService.generateTrayTempId(this.customer.customerId.toString()).subscribe(
        (trayTempId) => {
          this.trayTempId = trayTempId;
          this.loadCategory();
          localStorage.setItem('trayTempId', JSON.stringify(trayTempId));
          this.getTrayTempId();
        },
        (error) => {
          console.error('Error generating TrayTempId:', error);
        }
      );
    } else {
      this.getTrayTempId(); 
    }
  }
  
  getTrayTempId(): void {
    if (!this.customer.customerId) {
      console.error('Customer Id not found');
      return;
    }
  
    this.menuService.GetTraytempId(this.customer.customerId).subscribe({
      next: (res) => {
        console.log('Received trayTempId:', res.data);
        this.trayTempId = res.data;
        this.fetchTrayItems();
      },
      error: (error) => {
        console.error('Error fetching trayTempId:', error);
      }
    });
  }
  
  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.menus = res.data;
          this.loadCategory();
          this.fetchTrayItems();
          this.loadMOP();
          this.groupedMenu = this.groupByCategory(this.menus);
          console.log("load menus", this.menus)
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

  loadMOP(): void {
    this.menuService.getAllMOP().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.mop = res.data;
          console.log('Received MOP data:', res.data);

          this.modeOfPaymentId = 1;
        }
      },
      error: (err) => {
        console.error('Error fetching MOP data:', err);
      }
    });
  }

  onMOPSelectionChange(event: any): void {
    this.modeOfPaymentId = event.target.value;
    console.log('Selected MOP:', this.modeOfPaymentId);
  }

  filtSelect(index: number) {
    this.filterSelected = index;
    this.setActiveIndex(this.filterSelected);  
  }

  setActiveIndex(index: number | 0) {
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


  getCategoryName(categoryId: any): any {
    console.log(categoryId);
    const categoryIdNumber = parseInt(categoryId, 10);
    const correspondingCategory = this.category.find(cat => cat.categoryId === categoryIdNumber);
    
    console.log(categoryIdNumber, correspondingCategory);
    return correspondingCategory ? correspondingCategory.category : categoryId;
  }

  addToTray(menuItem: Menu) {
    if (menuItem.stock > 0) {
      const isItemAlreadyInTray = this.trayItems.some(item => item.item === menuItem.item);
      if (!isItemAlreadyInTray) {
        const trayItem = {
          item: menuItem.itemId,
          quantity: 1,
          addStamp: new Date().toISOString()
        };
        this.insertDataToTray(trayItem);
      } else {
        this.toastr.warning('Item is already in the tray');
      }
    } 
  }
  
  insertDataToTray(trayItem: any) {
    const data = {
      items: [trayItem], 
      trayTempId: this.trayTempId 
    };

    this.menuService.insertData(data).subscribe(
      response => {
        console.log('Data inserted to tray successfully:', response);
        this.toastr.success('Item added to tray successfully');
        this.fetchTrayItems();
      },
      error => {
        console.error('Error inserting data to tray:', error);
        this.toastr.error('Error adding item to tray');
      }
    );
  }
  
  
  fetchTrayItems() {
    if (typeof localStorage !== 'undefined') {
      const storedTrayItems = localStorage.getItem('trayItems');
      if (storedTrayItems) {
        this.trayItems = JSON.parse(storedTrayItems);
        this.filterOutStockZeroItems(); 
        this.fetchTrayItemDetails(); 
        this.calculateTotal();
      } else {
        const trayTempId = this.trayTempId ? parseInt(this.trayTempId) : null;
        if (trayTempId !== null) {
          this.menuService.getItemsByTrayTempId(trayTempId).subscribe({
            next: (res) => {
              if (res && res.data) {
                this.trayItems = res.data.filter((item: trayItemTest) => item.trayTempId === trayTempId);
                this.filterOutStockZeroItems(); 
                this.fetchTrayItemDetails(); 
                this.calculateTotal();
                console.log('Tray items loaded from server:', this.trayItems);
              }
            },
            error: (error) => {
              console.error('Error loading tray items:', error);
            }
          });
        } 
      }
    }
  }
  
  filterOutStockZeroItems() {
    this.trayItems = this.trayItems.filter(item => {
      const menuItem = this.menus.find(menu => menu.itemId === item.item);
      const shouldKeepItem = menuItem ? menuItem.stock > 0 : true;
      if (!shouldKeepItem) {
        this.toastr.show(`Removed item '${item.item}' from tray due to stock value of 0`);
      }
      return shouldKeepItem;
    });
  
  
  }
  
  orderNow() {
    const orderStamp = new Date().toISOString();
  
    this.menus.forEach(menu => {
      console.log(menu.stock); 
    });

    if (this.customer.customerId && this.trayTempId && this.modeOfPaymentId && this.trayItems) {
    this.trayItems.forEach(trayItem => {
    const menuItem = this.menus.find(menu => menu.itemId === trayItem.itemiD);
    if (menuItem && trayItem.quantity !== undefined) {
      const newStock = menuItem.stock - trayItem.quantity;
      this.updateMenuStock(trayItem.itemiD, newStock);
    }
  });

      const orderItems = this.trayItems.map(item => ({ itemId: item.itemiD.itemId, quantity: item.quantity }));
  
      this.menuService.insertTempToNotTemp(this.customer.customerId, this.trayTempId, orderStamp, this.order.Cost, this.modeOfPaymentId, orderItems).subscribe(
        (response) => {
          this.toastr.success('Item transported to tray successfully');
          localStorage.removeItem('trayTempId');
          this.fetchTrayItems();
          this.router.navigateByUrl('layout/order');
        },
        (error) => {
          console.error('Error placing order', error);
        }
      );
    } else {
      console.error('Customer Id or Tray Temp Id is missing.');
    }
  }
  
  updateMenuStock(itemId: number, newStock: number) {
    this.menuService.updateMenu(itemId, newStock).subscribe(
      response => {
        console.log('Menu stock updated successfully:', response);
      },
      error => {
        console.error('Error updating menu stock:', error);
      }
    );
  }
  
  increaseQuantity(trayItem: trayItemTest) {
    console.log('trayItem:', trayItem);
    const menuItem = this.menus.find(menu => menu.itemId === trayItem.item);
    console.log('menuItem:', menuItem);
    
    if (!menuItem) {
      this.toastr.warning('Menu item not found.');
      return;
    }
    
    if (trayItem.quantity < menuItem.stock) {
      trayItem.quantity++; 
      this.updateTrayItemQuantity(trayItem.trayItemTempId, trayItem.quantity); 
      this.calculateTotal();
      this.toastr.success('Added item quantity successfully');
    } else {
      this.toastr.warning('Cannot exceed available stock.');
    }
  }
  
  decreaseQuantity(trayItem: trayItemTest) {
    if (trayItem.quantity > 1) {
      trayItem.quantity--; 
      this.updateTrayItemQuantity(trayItem.trayItemTempId, trayItem.quantity); 
      this.calculateTotal();
      this.toastr.success('Reduced item quantity successfully');
    }
  }

  updateTrayItemQuantity(trayItemId: number, newQuantity: number) {
  this.menuService.updateTrayItemQuantity(trayItemId, newQuantity).subscribe(
    response => {
      console.log('Tray item quantity updated successfully:', response);
    },
    error => {
      console.error('Error updating tray item quantity:', error);
    }
  );
  }

  removeItem(trayItem: TrayItem) {
  const trayItemTempId = trayItem.trayItemTempId;
  this.menuService.deleteTrayItem(trayItemTempId).subscribe(
    response => {
      if (response.isSuccess) {
        this.toastr.success('Removed item successfully');
        console.log(response.message);
        this.fetchTrayItems();
      } else {
        console.error(response.message);
      }
    },
    error => {
      console.error('Error occurred:', error);
    }
  );
}

fetchTrayItemDetails() {
  this.trayItems.forEach(trayItem => {
    const menuItem = this.menus.find(menu => menu.itemId === trayItem.item);
    if (menuItem) {
      trayItem.itemiD = menuItem.itemId;
      trayItem.item = menuItem.item;
      trayItem.foodImage = menuItem.foodImage;
      trayItem.price = menuItem.price;
      trayItem.stock = menuItem.stock;
    } else {
      console.warn(`Menu item not found for tray item with ID ${trayItem.item}`);
    }
  });
}


  calculateTotal() {
    this.order.subTotal = this.trayItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.order.Cost = this.order.subTotal; 
  }

  getAllMOP() {
    this.menuService.getAllMOP().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.mop = res.data;
          console.log("Response", res);
  
          if (this.mop && this.mop.length > 0) {
            this.mop.forEach(mop => {
              if (mop && mop) {
                console.log("Item:", mop.modeOfPaymentId);
                console.log("Item ID:", mop.modeOfPayment);
              } else {
                console.error("Menu item or its data is undefined:", mop);
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
  
}