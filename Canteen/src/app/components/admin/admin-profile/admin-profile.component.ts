import { Component, OnInit } from '@angular/core';
import { Admin, AdminName } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  admin: Admin = {} as Admin;
  adminName: AdminName = {} as AdminName;
  enableEditing: boolean = false;
  inputNameActive: number = 0;
  activeIndex: number = 0;
  btnActive: boolean = false;
  updateSuccess: boolean = false;
  
  constructor(
    private adminService: AdminService,
    private customerService: CustomerService,
    private router: Router,
    private toaster: ToastrService

  ) { }

  ngOnInit() {
    this.loadAdminData();
    this.inputNameActive = this.getActiveIndex();
  }

  loadAdminData() {
    this.adminService.loadCustomerData().subscribe({
      next: (res) => {
        this.toaster.success('Received Admin Data!')
        this.admin = res.data;
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

  updateName(){
    this.customerService.editName(this.admin).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toaster.success('Admin Name updated successfully');
          this.loadAdminData();
          window.location.reload();
        } else {
          alert(res && res.message ? res.message : 'Update failed');
        }
      },
      (error) => {
        console.error('Update failed:', error);
        this.toaster.error('An error occurred during the update');
      }
    );
  }
}
  
