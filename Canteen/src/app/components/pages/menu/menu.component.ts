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

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})

export class MenuComponent implements OnInit {
  customer: Customer = new Customer();
  customerId!: number;
  menus: Menu[] = [];
  filteredMenu: Menu[] = [];
  selectedCategory: number = 0;
  trayItems: any[] = [];
  subTotal: number = 0;
  discount: number = 0;
  total: number = 0;
  trayTempId: string | null = null; 
  trayTempIdNum: number = 0; 
  

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadCustomerData();
    this.loadMenu(); 
    this.fetchTrayItems();
  }
  
  loadCustomerData(): void {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res.data.customerId);
        this.customerId = res.data.customerId;
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
      this.menuService.generateTrayTempId(this.customerId.toString()).subscribe(
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
    if (!this.customerId) {
      console.error('Customer Id not found');
      return;
    }
  
    this.menuService.GetTraytempId(this.customerId).subscribe({
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
      next: (response: any) => {
        if (response && response.data) {
          this.menus = response.data;
          this.filterMenu();
        }
      },
      error: (error) => {
      }
    });
  }

  filterMenu() {
    console.log('Selected Category:', this.selectedCategory);
    console.log('All Menus:', this.menus);

    if (this.selectedCategory === 0) {
      this.filteredMenu = [...this.menus];
    } else {
      this.filteredMenu = this.menus.filter(menu => menu.category === this.selectedCategory);
    }

    console.log('Filtered Menu:', this.filteredMenu);
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
            next: (response: any) => {
              if (response && response.data) {
                this.trayItems = response.data.filter((item: any) => item.trayTempId === trayTempId);
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

  updateTrayItemQuantity(trayItemId: number, newQuantity: number) {
  // Call the method with both parameters
  this.menuService.updateTrayItemQuantity(trayItemId, newQuantity).subscribe(
    response => {
      console.log('Tray item quantity updated successfully:', response);
      // Handle success message or any other action if needed
    },
    error => {
      console.error('Error updating tray item quantity:', error);
      // Handle error message or any other action if needed
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
    this.subTotal = this.trayItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.total = this.subTotal - this.discount;
  }

  getAllMenus() {
    this.menuService.getAllMenu().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.menus = response.data;
          console.log("Response", response);

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
          console.error('Error retrieving menus:', response.message);
        }
      }
    );
  }
}