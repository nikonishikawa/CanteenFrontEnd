import { Component, OnInit } from '@angular/core';
import { Admin } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../../services/vendor.service';
import { UpdateVendorDto } from '../../../models/load-data.model';
import { RegisterService } from '../../../services/register.service';
import { Address } from '../../../models/manage-user.model';
import { ManageVendorService } from '../../../services/manage-vendor.service';
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit {
  admin: Admin = {} as Admin;
  vendor: UpdateVendorDto = {} as UpdateVendorDto;
  address: Address[] = [];
  enableEditing: boolean = false;
  inputNameActive: number = 0;
  activeIndex: number = 0;
  btnActive: boolean = false;
  updateSuccess: boolean = false;
  
  
  constructor(
    private vendorService: VendorService,
    private router: Router,
    private toaster: ToastrService,
    private registerService: RegisterService,
    private vendService: ManageVendorService

  ) { }

  ngOnInit() {
    this.loadVendorData();
    this.loadAllAddress();
  }

  loadVendorData() {
    this.vendorService.loadVendorData().subscribe({
      next: (res) => {
        this.toaster.success('Received Vendor Data!')
        this.vendor = res.data;
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

  loadAllAddress(): void {
    this.registerService.getAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching address data:', err);
      }
    });
  }

  updateName(){
    this.vendService.updateVendor(this.vendor).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toaster.success('Vendor updated successfully');
          this.loadVendorData();
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