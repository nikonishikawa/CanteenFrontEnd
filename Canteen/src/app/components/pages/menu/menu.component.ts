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

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadMenu();
    this.loadCustomerData();
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res.data.customerId);
        this.customerId = res.data.customerId;
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
      TrayTempId: '' // Initialize TrayTempId for the first item
    };

    if (this.trayItems.length === 0) {
      trayItem.TrayTempId = this.generateTrayTempId(); // Generate TrayTempId for the first item
    } else {
      trayItem.TrayTempId = this.trayItems[0].TrayTempId; // Use the TrayTempId of the first item for subsequent items
    }

    this.trayItems.push(trayItem);
    this.calculateTotal();

    // Immediately insert the selected item into the temporary table
    this.insertDataToTray(menuItem, trayItem.TrayTempId);
  }

  calculateTotal() {
    this.subTotal = this.trayItems.reduce((total, item) => total + item.price * item.quantity, 0);
    // Implement discount calculation logic if needed
    this.total = this.subTotal - this.discount;
  }

  orderNow() {
    const data = {
      cusId: this.customerId,
      items: this.trayItems.map(item => ({
        item: item.itemId,
        quantity: item.quantity,
        addStamp: new Date().toISOString()
      }))
    };

    this.menuService.insertData(data).subscribe(
      response => {
        console.log('Data inserted to tray successfully:', response);
        this.toastr.success('Items added to tray successfully');
        this.clearTray();
      },
      error => {
        console.error('Error inserting data to tray:', error);
        this.toastr.error('Error adding items to tray');
      }
    );
  }

  clearTray() {
    this.trayItems = [];
    this.subTotal = 0;
    this.discount = 0;
    this.total = 0;
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

  insertDataToTray(menuItem: Menu, trayTempId: string) {
    if (!this.customerId) {
      this.toastr.error('Customer ID not found');
      return;
    }

    const data = {
      cusId: this.customerId,
      items: [
        {
          item: menuItem.itemId,
          TrayTempId: trayTempId, // Pass the TrayTempId along with the item
          addStamp: new Date().toISOString()
        }
      ]
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

  generateTrayTempId(): string {
    // Implement your logic to generate a unique TrayTempId
    // For example, you can use a combination of timestamp and random numbers
    return 'TRAY_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }
}