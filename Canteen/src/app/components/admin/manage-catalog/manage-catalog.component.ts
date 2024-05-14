import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../models/manage-address.model';
import { ManageAddressService } from '../../../services/manage-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCategoryService } from '../../../services/manage-category.service';
import { CategoryDto } from '../../../models/manage-category.model';

@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})

export class ManageCatalogComponent implements OnInit {
  address: Address[] = [];
  onAddress: Address = {} as Address;
  category: CategoryDto[] = [];
  onCategory: CategoryDto = {} as CategoryDto;
  addAddressModal: boolean = false;
  addCategoryModal: boolean = false;

  constructor(
    private manageAddressService: ManageAddressService,
    private manageCategoryService: ManageCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAddress();
    this.loadCategory();
  }

  addUserModal() {
    this.addAddressModal = true;
    
  }
  closeModal() {
    this.addAddressModal = false;
  }

  addCatModal() {
    this.addCategoryModal = true;
    
  }
  closeCatModal() {
    this.addCategoryModal = false;
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

  loadCategory() {
    this.manageCategoryService.getAllCategory().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.category = res.data;
          console.log("load category", this.category);
        }
      },
      error: (error) => {
        console.error('Error fetching category:', error);
      }
    });
  }

  onAddressRegistration() {
    this.manageAddressService.addAddress(this.onAddress).subscribe(
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

  openEditAddressModal(address: Address){
    this.addCategoryModal = true;
    this.onAddress = {
      addressId: address.addressId,
      barangay:  address.barangay,
      postalCode: address.postalCode,
      region: address.region
    }
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

  onCategoryRegistration() {
    this.manageCategoryService.addCategory(this.onCategory).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Category Registration Successful'); 
          this.addCategoryModal = false;
          this.loadCategory();
        } else {
          alert(res && res.message ? res.message : 'Category Registration failed');
        }
      },
      (error) => {
        console.error('Category Registration failed:', error);
        this.toastr.error('An error occurred during Category Registration');
      }
    );
  }


  deleteCategory(categoryId: number) {
    this.manageCategoryService.deleteCategory(categoryId).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.warning('Category Deletion Successful');
          this.loadCategory();
        } else {
          alert(res && res.message ? res.message : 'Category Deletion failed');
        }
      },
      (error) => {
        console.error('Category Deletion failed:', error);
        this.toastr.error('An error occurred during Category Deletion');
      }
    );
  }
}