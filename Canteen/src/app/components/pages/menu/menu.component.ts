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
  trayTempId: string = ''; 
  trayTempIdNum: number = 0; 

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private customerService: CustomerService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadCustomerData();
    this.fetchTrayTempId();
    this.loadMenu();
  }

  loadCustomerData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.customerService.loadCustomerData().subscribe({
        next: (res) => {
          console.log('Received customer data:', res.data.customerId);
          this.customerId = res.data.customerId;
          resolve();
        },
        error: (error) => {
          console.error('Error loading customer data:', error);
          reject(error);
        }
      });
    });
  }

  fetchTrayTempId() {
    this.menuService.getTrayTempIdByCustomerId(this.customerId).subscribe({
      next: (trayTempId: number) => {
        this.trayTempIdNum = trayTempId;
        console.log('TrayTempId:', trayTempId);
      },
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
        console.error('Error loading menu:', error);
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
      itemId: menuItem.itemId,
      itemName: menuItem.item,
      price: menuItem.price,
      quantity: 1,
      TrayTempId: this.trayTempId, 
      addStamp: new Date().toISOString()
    };
  
    this.trayItems.push(trayItem);
    this.calculateTotal();
    this.insertDataToTray(this.trayItems);
  
    localStorage.setItem('trayItems', JSON.stringify(this.trayItems));
  }

  fetchTrayItems() {
    const storedTrayItems = localStorage.getItem('trayItems');
    if (storedTrayItems) {
      this.trayItems = JSON.parse(storedTrayItems);
      this.calculateTotal();
    } else {
      this.menuService.getItemsByTrayTempId(this.trayTempIdNum).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.trayItems = response.data;
            this.calculateTotal();
          }
        },
        error: (error) => {
          console.error('Error loading tray items:', error);
        }
      });
    }
  }
  

  insertDataToTray(trayItems: any[]) {
    const data = {
      cusId: this.customerId,
      items: trayItems.map(item => ({
        item: item.itemId,
        TrayTempId: item.TrayTempId,
        quantity: item.Quantity,
        addStamp: item.addStamp 
      }))
    };

    this.menuService.insertData(data).subscribe(
      response => {
        console.log('Data inserted to tray successfully:', response);
        this.toastr.success('Item added to tray successfully');
      },
      error => {
        console.error('Error inserting data to tray:', error);
        this.toastr.error('Error adding item to tray');
      }
    );
  }

  calculateTotal() {
    this.subTotal = this.trayItems.reduce((total, item) => total + item.price * item.quantity, 0);
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