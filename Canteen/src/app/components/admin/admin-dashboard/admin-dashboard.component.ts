import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadDataService } from '../../../services/load-data.service';
import { TotalRev } from '../../../models/load-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})

export class AdminDashboardComponent implements OnInit{
  menus: Menu[] = [];
  totalRev: TotalRev[] = [];
  totalRevenueForMonth: number = 0;

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private router: Router,
    private loadDataService: LoadDataService
  ) { }

  ngOnInit(): void {
    this.loadMenu(); 
    this.loadTotalRevData();
  }

  loadMenu() {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.menus = res.data;
          console.log("Items loaded", this.menus);
        }
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
  }

  loadTotalRevData() {
    this.loadDataService.getTotalRev().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.totalRev = res.data;
          console.log("Total Rev Data", this.totalRev);

          this.calculateTotalRevenueForMonth();
        }
      },
      error: (error) => {
        console.error('Error fetching Rev Data:', error);
      }
    });
  }

  calculateTotalRevenueForMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();

    const ordersForCurrentMonth = this.totalRev.filter(order => {
      const orderDate = new Date(order.completedStamp);
      return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === currentYear;
    });

    this.totalRevenueForMonth = ordersForCurrentMonth.reduce((total, order) => total + order.price, 0);
  }
}