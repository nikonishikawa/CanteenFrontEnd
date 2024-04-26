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

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})

export class MenuComponent implements OnInit {
  customer: CustomerDto = {} as CustomerDto;
  menus: Menu[] = [];
  category: Category[] = [];
  filteredMenu: Menu[] = [];
  trayitemtest: trayItemTest[] = [];
  trayItems: any[] = [];
  trayTempId: string | null = null; 
  order: OrderDTO = {} as OrderDTO;
  tray: Tray = {} as Tray;
  mop: MOP[] = [];
  modeOfPaymentId: number = 0;
  OrderID: number = 0;
  selectedCategory: number = 0;

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategory();
    this.loadCustomerData();
    this.loadMenu(); 
    this.fetchTrayItems();
    this.loadMOP();
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
          this.filterMenu(0);
        }
      },
      error: (error) => {
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

  loadMOP(): void {
    this.menuService.getAllMOP().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.mop = res.data;
          console.log('Received MOP data:', res.data);
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
  
  filterMenu(categoryId: number) {
    const uniqueCategories = [...new Set(this.menus.map(menu => menu.category))];
    this.category = this.category.filter(cat => uniqueCategories.includes(cat.categoryId));
    this.selectedCategory = categoryId; 

    if (this.selectedCategory === 0) {
      this.filteredMenu = [...this.menus];
    } else {
      this.filteredMenu = this.menus.filter(menu => menu.category === this.selectedCategory);
    }

    // console.log('Filtered Menu:', this.filteredMenu);
    // console.log('All Menus:', this.menus);
    // console.log('Unique Categories:', uniqueCategories);
}


  getCategoryName(categoryId: number): string {
    const correspondingCategory = this.category.find(cat => cat.categoryId === categoryId);
    return correspondingCategory ? correspondingCategory.category : '';
  }

  addToTray(menuItem: Menu) {
    const trayItem = {
      item: menuItem.itemId,
      quantity: 1,
      addStamp: new Date().toISOString()
    };
  
    this.insertDataToTray(trayItem); 
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
        this.fetchTrayItemDetails(); 
        this.calculateTotal();
      } else {
        const trayTempId = this.trayTempId ? parseInt(this.trayTempId) : null;
        if (trayTempId !== null) {
          this.menuService.getItemsByTrayTempId(trayTempId).subscribe({
            next: (res) => {
              if (res && res.data) {
                this.trayItems = res.data.filter((item: trayItemTest) => item.trayTempId === trayTempId);
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
  
  //     this.menuService.insertOrderStatus(this.customer.customerId, orderStamp, this.order.Cost, this.modeOfPaymentId)
 orderNow() {
  this.fetchTrayItemDetails();
  const orderStamp = new Date().toISOString();

  if (this.customer.customerId && this.trayTempId && this.modeOfPaymentId && this.trayitemtest) {
    
    const items = this.trayitemtest.map(item => ({ price: item.price }));
   
    this.menuService.insertTempToNotTemp(this.customer.customerId, this.trayTempId, orderStamp, this.order.Cost, this.modeOfPaymentId, items).subscribe(
      (response) => {
        this.toastr.success('Item transported to tray successfully');
        localStorage.removeItem('trayTempId');
        this.fetchTrayItems();
        this.router.navigateByUrl('layout');
      },
      (error) => {
        console.error('Error placing order', error);
      }
    );
  } else {
    console.error('Customer Id or Tray Temp Id is missing.');
  }
}
  

  increaseQuantity(trayItem: trayItemTest) {
    trayItem.quantity++; 
    this.updateTrayItemQuantity(trayItem.trayItemTempId, trayItem.quantity); 
    this.calculateTotal();
    this.toastr.success('Added item quantity successfully');
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
        trayItem.item = menuItem.item;
        trayItem.foodImage = menuItem.foodImage;
        trayItem.price = menuItem.price;
      }
    });
  }

  calculateTotal() {
    this.order.subTotal = this.trayItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.order.Cost = this.order.subTotal; 
  }

  getAllCategories() {
  this.menuService.getAllCaetegory().subscribe(
    (res) => {
      if (res.isSuccess) {
        this.category = res.data;
        console.log("Response", res);

        if (this.category && this.category.length > 0) {
          this.category.forEach(category => {
            if (category && category) {
              console.log("Item ID:", category.categoryId);
              console.log("Item:", category.category);
              console.log("Description:", category.description);
            } else {
              console.error("Menu item or its data is undefined:", category);
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
}