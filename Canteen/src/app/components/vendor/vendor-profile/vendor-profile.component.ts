import { Component, OnInit } from '@angular/core';
import { Admin, AdminName } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit {
  admin: Admin = {} as Admin;
  adminName: AdminName = {} as AdminName;
  enableEditing: boolean = false;
  
  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService

  ) { }

  ngOnInit() {
    this.loadAdminData();
    console.log("hello")
  }

  loadAdminData() {
    this.adminService.loadAdminData().subscribe({
      next: (res) => {
        console.log('Received Admin Data:', res);
        this.toaster.success('Received Admin Data!')
        this.admin = res.data;
        this.loadCustomerName();
      }
    });
  }

  loadCustomerName() {
    this.customerService.getCustomerName(this.admin.adminName).subscribe({
      next: (res) => {
        this.adminName = res.data;
        console.log('Received Admin Name:', res);
      },
      error: (error) => {
        console.error('Error loading Admin Name:', error);
      }
    });
  }

  toggleEditing() {
    this.enableEditing = !this.enableEditing;
  }
}
