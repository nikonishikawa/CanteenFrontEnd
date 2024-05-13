import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadDataService } from '../../../services/load-data.service';
import { SalesData, SalesProductDTO, TotalRev } from '../../../models/load-data.model';
import { CommonModule } from '@angular/common';
import Chart, { registerables } from 'chart.js/auto';

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
    private loadDataService: LoadDataService,
    
  ) {
    Chart.register(...registerables);
   }

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

    const filteredMenus = this.menus.filter(menu => menu.stock !== 0);
    // Prepare data for the doughnut chart
    const data = {
      labels: filteredMenus.map(menu => menu.item),
      datasets: [{
        label: 'Stock',
        data: filteredMenus.map(menu => menu.stock), // Calculate percentage of total stock
        backgroundColor: this.getRandomColors(filteredMenus.length), // Generate random colors for each menu
        hoverOffset: 20
      }]
    };

    data.labels.sort((a, b) => a.localeCompare(b));

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
              padding: 8,
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
    const minRed = 255; // Minimum red value (to create yellow)
    const maxRed = 255; // Maximum red value (to create red)
    const minGreen = 0; // Minimum green value (to create yellow)
    const maxGreen = 255; // Maximum green value (to create yellow)
    const alpha = 0.6; // Alpha value for transparency
  
    for (let i = 0; i < count; i++) {
        const red = Math.floor(Math.random() * (maxRed - minRed + 1)) + minRed; 
        const green = Math.floor(Math.random() * (maxGreen - minGreen + 1)) + minGreen; 
        colors.push(`rgba(${red}, ${green}, 0, ${alpha})`);
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
          this.renderMonthlyQuantityChart();
          this.renderMonthlyPriceChart();
        }
      },
      error: (error) => {
        console.error('Error fetching Rev Data:', error);
      }
    });
  }

  renderMonthlyQuantityChart() {
    const currentDate = new Date();
    const last5Months = [];
    for (let i = 0; i < 5; i++) {
      last5Months.push({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
  
    const monthlyData = last5Months.map(month => {
      const ordersForMonth = this.totalRev.filter(order => {
        const orderDate = new Date(order.completedStamp);
        return orderDate.getMonth() + 1 === month.month && orderDate.getFullYear() === month.year;
      });
  
      const totalQuantity = ordersForMonth.reduce((total, order) => total + order.quantity, 0);
  
      return {
        month: month.month,
        year: month.year,
        totalQuantity: totalQuantity
      };
    });
  
    const labels = monthlyData.map(data => `${data.month}/${data.year}`);
    const totalQuantityData = monthlyData.map(data => data.totalQuantity);
  
    const ctx = document.getElementById('monthlyQuantityChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Sold Items',
            data: totalQuantityData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  renderMonthlyPriceChart() {
    const currentDate = new Date();
    const last5Months = [];
    for (let i = 0; i < 5; i++) {
      last5Months.push({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
  
    const monthlyData = last5Months.map(month => {
      const ordersForMonth = this.totalRev.filter(order => {
        const orderDate = new Date(order.completedStamp);
        return orderDate.getMonth() + 1 === month.month && orderDate.getFullYear() === month.year;
      });
  
      const totalPrice = ordersForMonth.reduce((total, order) => total + order.price, 0);
  
      return {
        month: month.month,
        year: month.year,
        totalPrice: totalPrice
      };
    });
  
    const labels = monthlyData.map(data => `${data.month}/${data.year}`);
    const totalPriceData = monthlyData.map(data => data.totalPrice);
  
    const ctx = document.getElementById('monthlyPriceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Sales',
            data: totalPriceData,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0
          }
        }
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


