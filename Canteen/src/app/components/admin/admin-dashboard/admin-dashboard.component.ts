import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadDataService } from '../../../services/load-data.service';
import { SalesData, SalesProductDTO, TotalRev } from '../../../models/load-data.model';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  menus: Menu[] = [];
  totalRev: TotalRev[] = [];
  totalRevenueForMonth: number = 0;
  salesPerProduct: SalesData = {}; 
  sortedSalesPerProduct: SalesProductDTO[] = [];
  highestSalesProduct: { name: string, price: number, quantitySold: number } = { name: '', price: 0, quantitySold: 0 };
  menuStockChart: any;
  
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
          
          this.loadChart();
        }
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      }
    });
    
  }

  loadChart() {
    const totalStock = this.calculateTotalStock();

    // Prepare data for the doughnut chart
    const data = {
      labels: this.menus.map(menu => menu.item),
      datasets: [{
        label: 'Stock',
        data: this.menus.map(menu => menu.stock), // Calculate percentage of total stock
        backgroundColor: this.getRandomColors(this.menus.length), // Generate random colors for each menu
        hoverOffset: 24
      }]
    };

    // Render doughnut chart
    const ctx = document.getElementById('menuStockChart') as HTMLCanvasElement;
    this.menuStockChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              padding: 8
            }
          }
        }
      }
    });
  }

  calculateTotalStock(): number {
    return this.menus.reduce((total, menu) => total + menu.stock, 0);
  }

  getRandomColors(count: number): string[] {
    const colors = [];
    const minRed = 100; // Minimum red value
    const maxRed = 255; // Maximum red value
    const alpha = 0.6; // Alpha value for transparency
  
    for (let i = 0; i < count; i++) {
      const red = Math.floor(Math.random() * (maxRed - minRed + 1)) + minRed; // Generate random red value
      colors.push(`rgba(${red}, 0, 0, ${alpha})`); // Add the color to the array with zero green and blue
    }
    
    return colors;
  }

  loadTotalRevData() {
    this.loadDataService.getTotalRev().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.totalRev = res.data;
          console.log("Total Rev Data", this.totalRev);

          this.calculateTotalRevenueForMonth();
          this.calculateSalesPerProduct(); 
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
  
  
  calculateSalesPerProduct() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
  
    const ordersForCurrentMonth = this.totalRev.filter(order => {
      const orderDate = new Date(order.completedStamp);
      return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === currentYear;
    });
  
    const salesData: SalesData = {};
    ordersForCurrentMonth.forEach(order => {
      if (!salesData[order.itemName]) {
        salesData[order.itemName] = {
          name: order.itemName,
          price: order.price,
          quantitySold: order.quantity
        };
      } else {
        salesData[order.itemName].quantitySold += order.quantity;
      }
    });
  
    this.salesPerProduct = salesData;

    const sortedProducts = Object.values(this.salesPerProduct).sort((a, b) => b.price - a.price);
    if (sortedProducts.length > 0) {
      this.highestSalesProduct = sortedProducts[0];
    }

  }

  getPercent(initial: any): number {
    const total = this.menus.reduce((sum, stock) => sum + stock.stock, 0);
    const calculatedPercent = initial / total;
    const final = calculatedPercent * 100;
    const finalFormatted = +final.toFixed(2);
    return finalFormatted;
  }
  
}


