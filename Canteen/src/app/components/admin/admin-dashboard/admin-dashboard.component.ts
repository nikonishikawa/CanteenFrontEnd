import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  menus: Menu[] = [];

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loadMenu(); 
  }


  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.menus = res.data;
          console.log("Items loaded" , this.menus);
        }
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
  }

  
}
