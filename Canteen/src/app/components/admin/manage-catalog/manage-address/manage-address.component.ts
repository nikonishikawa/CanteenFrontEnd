import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../../models/manage-address.model';
import { ManageAddressService } from '../../../../services/manage-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCategoryService } from '../../../../services/manage-category.service';

@Component({
  selector: 'app-manage-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-address.component.html',
  styleUrl: './manage-address.component.css'
})

export class ManageAddressComponent implements OnInit {
  address: Address[] = [];
  addAddress: Address = {} as Address;
  onAddress: Address = {} as Address;
  addAddressModal: boolean = false;
  editAddressModal: boolean = false;

  constructor(
    private manageAddressService: ManageAddressService,
    private manageCategoryService: ManageCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAddress();
  }

  loadAddress() {
    this.manageAddressService.getAllAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
          console.log("load address", this.address);
        }
      },
      error: (error) => {
        console.error('Error fetching address:', error);
      }
    });
  }

  addUserModal() {
    this.addAddressModal = true;
    
  }
  closeModal() {
    this.addAddressModal = false;
    this.editAddressModal = false;
  }

  onAddressRegistration() {
    this.manageAddressService.addAddress(this.addAddress).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Address Registration Successful'); 
          this.addAddressModal = false;
          this.loadAddress();
        } else {
          alert(res && res.message ? res.message : 'Address Registration failed');
        }
      },
      (error) => {
        console.error('Address Registration failed:', error);
        this.toastr.error('An error occurred during Address registration');
      }
    );
  }

  openEditAddressModal(adress: Address){
    this.onAddress = { ...adress}
    this.editAddressModal = true;
  }

  saveCustomer() {
    const updateAddress: Address = {
      addressId: this.onAddress.addressId,
      barangay: this.onAddress.barangay,
      region: this.onAddress.region,
      postalCode: this.onAddress.postalCode
    };

    this.manageAddressService.editAddress(updateAddress).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Address updated successfully');
          this.loadAddress();
          this.editAddressModal = false;
        } else {
          alert(res && res.message ? res.message : 'Update failed');
        }
      },
      (error) => {
        console.error('Update failed:', error);
        this.toastr.error('An error occurred during the update');
      }
    );
  }

  deleteAddress(AddressId: number) {
    this.manageAddressService.deleteAddress(AddressId).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.warning('Address Deletion Successful');
          this.loadAddress();
        } else {
          alert(res && res.message ? res.message : 'Address Deletion failed');
        }
      },
      (error) => {
        console.error('Address Deletion failed:', error);
        this.toastr.error('An error occurred during Address Deletion');
      }
    );
  }
}
