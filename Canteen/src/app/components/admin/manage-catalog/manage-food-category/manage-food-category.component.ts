import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../../models/manage-address.model';
import { ManageAddressService } from '../../../../services/manage-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCategoryService } from '../../../../services/manage-category.service';
import { CategoryDto } from '../../../../models/manage-category.model';

@Component({
  selector: 'app-manage-food-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-food-category.component.html',
  styleUrl: './manage-food-category.component.css'
})

export class ManageFoodCategoryComponent implements OnInit {
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
    this.loadCategory();
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
  
  addCatModal() {
    this.addCategoryModal = true;
    
  }
  closeCatModal() {
    this.addCategoryModal = false;
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

  openEditCatModal(category: CategoryDto){
    this.addCategoryModal = true;
    this.onCategory = {
      categoryId: category.categoryId,
      category:  category.category,
      description: category.description

    }
  }

  deleteCategory(categoryId: number) {
      this.manageCategoryService.deleteCategory(categoryId).subscribe(
        (res) => {
          if (res && res.isSuccess) {
            this.toastr.warning('Category Deletion Successful');
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
