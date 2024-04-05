import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Menu } from '../../../models/menu.model';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})

export class MenuComponent implements OnInit {
  menus: Menu[] = []; // Define menus as an array of Menu objects
  filteredMenu: Menu[] = [];
  selectedCategory: number = 0;
  constructor(private menuService: MenuService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMenu();
    // this.loadMenu();
  }

  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.menus = response.data;
          this.filterMenu(); // Apply initial filtering after loading menus
        } else {
          console.error('Error retrieving menus:', response.message);
          // Handle error here
        }
      },
      error: (error) => {
        console.error('Error fetching menus', error);
        // Handle error here
      }
    });
  }
  
  filterMenu() {
    console.log('Selected Category:', this.selectedCategory);
    console.log('All Menus:', this.menus);
  
    if (this.selectedCategory === 0) {
      this.filteredMenu = [...this.menus]; // Display all menu items if "Select Category" is chosen
    } else {
      this.filteredMenu = this.menus.filter(menu => menu.category === this.selectedCategory);
    }
  
    console.log('Filtered Menu:', this.filteredMenu);
  }
  
  
  
  
  
  
  

  // loadMenu() {
  //   this.menuService.getAllMenu().subscribe({
  //     next: (menus) => {
  //       this.menus = menus.category;
  //       this.filterMenu();
  //     },
  //     error: (response) => {
  //       console.log(response);
  //     }
  //   });
  // }
  
  getAllMenus() {
    this.menuService.getAllMenu().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.menus = response.data;
          console.log("Response", response);
  
          if (this.menus && this.menus.length > 0) {
            this.menus.forEach(menuItem => {
              if (menuItem && menuItem) {
                console.log("Item ID:", menuItem.itemId);
                console.log("Item:", menuItem.item);
                console.log("Description:", menuItem.description);
                console.log("Is Halal:", menuItem.isHalal);
                console.log("Price:", menuItem.price);
                console.log("Category:", menuItem.category);
              } else {
                console.error("Menu item or its data is undefined:", menuItem);
              }
            });
          } else {
            console.error("Menus array is empty or undefined");
          }
        } else {
          console.error('Error retrieving menus:', response.message);
        }
      },
      (error) => {
        // console.error('Error fetching menus', error);
      }
    );
  }

  // filterMenu() {
  //   if (this.selectedCategory === 0) {
  //     this.filteredMenu = [...this.menus]; // Display all menu items if "Select Category" is chosen
  //   } else {
  //     this.filteredMenu = this.menus.filter(menu => menu.category === this.selectedCategory);
  //   }
  // }
  

}
