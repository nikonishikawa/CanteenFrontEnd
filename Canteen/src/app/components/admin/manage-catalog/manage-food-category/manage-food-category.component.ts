import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../../models/manage-address.model';
import { ManageAddressService } from '../../../../services/manage-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCategoryService } from '../../../../services/manage-category.service';
import { CategoryDto } from '../../../../models/manage-catalog.model';

@Component({
  selector: 'app-manage-food-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-food-category.component.html',
  styleUrl: './manage-food-category.component.css'
})

export class ManageFoodCategoryComponent implements OnInit {
  category: CategoryDto[] = [];
  onCategory: CategoryDto = {} as CategoryDto;
  addCategoryModal: boolean = false;
  editCategoryModal: boolean = false;

  constructor(
    private manageCategoryService: ManageCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategory();
  }

  openEditCatModal(category: CategoryDto): void {
    this.onCategory = { ...category };
    this.editCategoryModal = true; 
  }
  

  saveCustomer() {
    const updateCategory: CategoryDto = {
      categoryId: this.onCategory.categoryId,
      category: this.onCategory.category,
      description: this.onCategory.description,
    };

    this.manageCategoryService.editCategory(updateCategory).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Category updated successfully');
          this.editCategoryModal = false;
          this.loadCategory();
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

  addCatModal(): void {
    this.addCategoryModal = true;
  }

  closeCatModal(): void {
    this.addCategoryModal = false;
  }
  closeCatEditModal(): void {
    this.editCategoryModal = false;
  }

  loadCategory(): void {
    this.manageCategoryService.getAllCategory().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.category = res.data;
          console.log('load category', this.category);
        }
      },
      error: (error) => {
        console.error('Error fetching category:', error);
      }
    });
  }

  
  onCategoryRegistration(): void {
    this.manageCategoryService.addCategory(this.onCategory).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Category Registration Successful');
          this.addCategoryModal = false;
          this.loadCategory();
        } else {
          alert(res && res.message ? res.message : 'Category Registration failed');
        }
      },
      error: (error) => {
        console.error('Category Registration failed:', error);
        this.toastr.error('An error occurred during Category Registration');
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.manageCategoryService.deleteCategory(categoryId).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.warning('Category Deletion Successful');
          this.loadCategory();
        } else {
          alert(res && res.message ? res.message : 'Category Deletion failed');
        }
      },
      error: (error) => {
        console.error('Category Deletion failed:', error);
        this.toastr.error('An error occurred during Category Deletion');
      }
    });
  }
}