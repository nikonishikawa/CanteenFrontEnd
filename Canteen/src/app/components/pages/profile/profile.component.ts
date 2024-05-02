import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer, CustomerName, address, customerGeneralAddress } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';

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
  inputNameActive: boolean = false;
  btnActive: boolean = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  onInputClick() {
    if (this.enableEditing) {
      this.inputNameActive = true;
    }
  }

  ngOnInit(): void {
    this.loadCustomerData();
  
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

  toggleEditing() {
    this.enableEditing = !this.enableEditing;
    this.btnActive = !this.btnActive;
  }

  updateName() {
    this.customerService.editName(this.customerName).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toggleEditing();
          this.toaster.success('Updated User Info Data Successfully!');
        } else {
          this.toaster.error('Error Updating User Info Data!');
        }
      },
      error: (error) => {
        console.error('Error updating name:', error);
      }
    });
  }

  updateAddress() {
    this.customerService.editAddress(this.customerAddress).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toggleEditing();
          this.toaster.success('Updated User Info Data Successfully!');
        } else {
          this.toaster.error('Error Updating User Info Data!');
        }
      },
      error: (error) => {
        console.error('Error updating name:', error);
      }
    });
  }
}
