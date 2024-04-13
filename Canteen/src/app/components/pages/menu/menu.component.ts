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
  addMenuRequest: Menu = new Menu();
  menus: Menu[] = []; 
  filteredMenu: Menu[] = [];
  selectedCategory: number = 0;
  constructor(private route: ActivatedRoute, private router: Router, private menuService: MenuService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.menus = response.data;
          this.filterMenu(); 
        } else {
          console.error('Error retrieving menus:', response.message);
        }
      }
    });
  }
  
  filterMenu() {
    console.log('Selected Category:', this.selectedCategory);
    console.log('All Menus:', this.menus);
  
    if (this.selectedCategory === 0) {
      this.filteredMenu = [...this.menus]; 
    } else {
      this.filteredMenu = this.menus.filter(menu => menu.category === this.selectedCategory);
    }
  
    console.log('Filtered Menu:', this.filteredMenu);
  }
  
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
      }
    );
  }
}
