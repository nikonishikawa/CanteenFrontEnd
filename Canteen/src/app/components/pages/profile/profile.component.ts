import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer, CustomerName, address, customerGeneralAddress } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RegisterService } from '../../../services/register.service';
import { Address } from '../../../models/manage-user.model';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  customer: Customer = {} as Customer;
  customerName: CustomerName = {} as CustomerName;
  customerAddress: customerGeneralAddress = {} as customerGeneralAddress;
  address: address = {} as address;
  enableEditing: boolean = false;
  inputNameActive: number = 0;
  activeIndex: number = 0;
  btnActive: boolean = false;
  updateSuccess: boolean = false;
  allAddress: Address[] = [];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService,
    private adressService: RegisterService
  ) { }

  ngOnInit(): void {
    this.loadCustomerData();
    this.loadAllAddress();
    this.inputNameActive = this.getActiveIndex();
  }

  loadCustomerData() {
    this.customerService.loadCustomerData().subscribe({
      next: (res) => {  
        this.customer = res.data;
        this.loadCustomerName();
        
      }
    });
  }

  loadCustomerName() {
    this.customerService.getCustomerName(this.customer.cusName).subscribe({
      next: (res) => {
        this.customerName = res.data;
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
      },
      error: (error) => {
        console.error('Error loading address:', error);
      }
    });
  }

  toggleEditing() {
    this.enableEditing = !this.enableEditing;
    this.inputNameActive = 0;
    this.btnActive = !this.btnActive;
  }

  toggleActive(index: number) {
    if (this.enableEditing) {
      this.inputNameActive = index;
      this.setActiveIndex(this.inputNameActive);
    }
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  setActiveIndex(index: number | 0) {
    this.activeIndex = index;
  }

  updateName() {
    const nameUpdate$ = this.customerService.editName(this.customerName);
    const addressUpdate$ = this.customerService.editAddress(this.customerAddress);
  
    forkJoin([nameUpdate$, addressUpdate$]).subscribe({
      next: ([nameRes, addressRes]) => {
        if (nameRes.isSuccess && addressRes.isSuccess) {
          this.toggleEditing();
          this.toaster.success('Updated User Info Data Successfully!');
        } else {
          this.toaster.error('Error Updating User Info Data!');
        }
      },
      error: (error) => {
        console.error('Error updating name or address:', error);
      }
    });
  }

loadAllAddress(): void {
  this.adressService.getAddress().subscribe({
    next: (res) => {
      if (res && res.data) {
        this.allAddress = res.data;
      }
    },
    error: (err) => {
      console.error('Error fetching address data:', err);
    }
  });
}
}
