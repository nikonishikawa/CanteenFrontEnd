import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../../services/register.service';
import { Register } from '../../../models/register.model';
import { Address } from '../../../models/manage-user.model';
import { getAllVendor } from '../../../models/manage-vendor.model';
import { ManageVendorService } from '../../../services/manage-vendor.service';

@Component({
  selector: 'app-manage-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-vendor.component.html',
  styleUrl: './manage-vendor.component.css'
})

export class ManageVendorComponent implements OnInit {
  vendorRegister: Register = new Register();
  address: Address[] = [];
  vendors: getAllVendor[] = [];
  editedVendor: getAllVendor = {} as getAllVendor;
  modalVendorOpen: boolean = false;
  modalOpen: boolean = false;

  constructor(
    private toastr: ToastrService,
    private registerService: RegisterService,
    private vendorService: ManageVendorService
  ) { }

  ngOnInit(): void {
    this.loadAllVendor();
    this.loadAllAddress();
  }

  addVendorModal() {
    this.modalVendorOpen = true;
  }

  closeModal() {
    this.modalVendorOpen = false;
    this.modalOpen = false;
  }

  openEditModal(vendor: getAllVendor) {
    this.editedVendor = { ...vendor };
    this.modalOpen = true;
  }

  onRegister() {
    this.registerService.RegisterVendor(this.vendorRegister).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Registration Successful');
          this.modalVendorOpen = false;
          this.loadAllVendor(); 
        } else {
          this.toastr.error(res && res.message ? res.message : 'Registration failed');
        }
      },
      (error) => {
        console.error('Registration failed:', error);
        this.toastr.error('An error occurred during registration');
      }
    );
  }

  loadAllAddress(): void {
    this.registerService.getAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
          console.log('Received address data:', res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching address data:', err);
      }
    });
  }

  loadAllVendor(): void {
    this.vendorService.getAllVendor().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.vendors = res.data;
          console.log('Load Vendor data:', res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching Vendor data:', err);
      }
    });
  }
}

