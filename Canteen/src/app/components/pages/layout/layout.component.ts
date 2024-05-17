import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';
import { Customer, CustomerName, address, customerGeneralAddress } from '../../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA], 
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isActive!: number | 1;
  customer: Customer = {} as Customer;
  customerName: CustomerName = {} as CustomerName;
  address: address = {} as address;
  customerAddress: customerGeneralAddress = {} as customerGeneralAddress;

  constructor(private layoutService: LayoutService,
              private customerService: CustomerService,
              private router: Router, 
              private menuService: MenuService,
              private toastr: ToastrService,) {}

  ngOnInit() {
    this.isActive = this.layoutService.getActiveIndex();
    this.loadCustomerData();
  }

  toggleActive(index: number) {
    this.isActive = index;
    this.layoutService.setActiveIndex(this.isActive);
  }  

  navigateTo(route: string, index: number) {
    console.log("butangag name", route);
    this.router.navigate([route]);
    this.toggleActive(index);
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {
        console.log('Received customer data:', res);
        this.customer = res.data;
        this.loadCustomerName();
      }
    });
  }

  loadCustomerName() {
    this.customerService.getCustomerName(this.customer.cusName).subscribe({
      next: (res) => {
        this.customerName = res.data;
        console.log('Received customer name:', res);
        this.loadCustomerAddress();
      },
      error: (error) => {
        console.error('Error loading customer name:', error);
      }
    });
  }
  
  loadCustomerAddress(){
    this.customerService.getCustomerAddress(this.customer.cusAddress).subscribe({
      next: (res) => {
        this.customerAddress = res.data;
        console.log('Received customer address:', res);
        this.loadAddress();
      },
      error: (error) => {
        console.error('Error loading customer name:', error);
      }
    });
  }

  loadAddress(){
    this.customerService.getAddress(this.customerAddress.addressId).subscribe({
      next: (res) => {
        this.address = res.data;
        console.log('Received address:', res);
      },
      error: (error) => {
        console.error('Error loading address:', error);
      }
    });
  }
  
  menu() {
    this.toastr.success('Moving to menu');
    
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.toastr.success('Logged Out Successfully');
    
  }

  // loadCategory() {
  //   this.menuService.getAllCaetegory().subscribe({
  //     next: (res) => {
  //       if (res && res.data) {
  //         console.log(res.data);
  //         this.category = res.data;
  //         this.filterMenu(0);
  //       }
  //     },
  //     error: (error) => {
  //     }
  //   });
  // }
}
