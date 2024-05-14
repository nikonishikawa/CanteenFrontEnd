import { Component, OnInit } from '@angular/core';
  import { Menu } from '../../../models/menu.model';
  import { Category } from '../../../models/category.model';
  import { MenuService } from '../../../services/menu.service';
  import { ToastrService } from 'ngx-toastr';
  import { Router } from '@angular/router';
  import { LoadDataService } from '../../../services/load-data.service';
  import { SalesData, SalesProductDTO, TotalRev } from '../../../models/load-data.model';
  import { CommonModule } from '@angular/common';
  import Chart, {registerables} from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
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
    selectedCategoryId: number = 0;
    category: Category[] = [];
    filteredMenus: Menu[] = [];
    legendColor: string = "";
    colors: any = "";

    
    constructor(
      private menuService: MenuService,
      private toastr: ToastrService,
      private router: Router,
      private loadDataService: LoadDataService
    ) { Chart.register(...registerables) }

    ngOnInit(): void {
      this.loadCategory();
      this.onCategoryChange(this.selectedCategoryId);
      this.loadTotalRevData();
    }

    loadMenu() {
      this.menuService.getAllMenu().subscribe({
        next: (res) => {
          if (res && res.data) {
            this.menus = res.data;
            console.log("Items loaded", this.menus);
            
            if (this.selectedCategoryId == 0) {
              this.filteredMenus = this.menus.filter(menu => menu.category !== this.selectedCategoryId);
              this.filteredMenus.sort((a, b) => {
                // First, compare by stock (numerically)
                if (a.stock !== b.stock) {
                  return a.stock - b.stock;
                }
                // If stock is the same, compare by item (alphabetically)
                return a.item.localeCompare(b.item);
              });
              this.loadChart();
            }
            else {
              this.filteredMenus = this.menus.filter(menu => menu.category == this.selectedCategoryId);
              this.filteredMenus.sort((a, b) => {
                // First, compare by stock (numerically)
                if (a.stock !== b.stock) {
                  return a.stock - b.stock;
                }
                // If stock is the same, compare by item (alphabetically)
                return a.item.localeCompare(b.item);
              });
              this.loadChart();
            }
          }
        },
        error: (error) => {
          console.error('Error fetching menu:', error);
        }
      });
      
    }

    loadCategory() {
      this.menuService.getAllCaetegory().subscribe({
        next: (res) => {
          if (res && res.data) {
            console.log("Cat loaded", res.data);
            this.category = res.data;
          }
        },
        error: (error) => {
        }
      });
    }

    onCategoryChange(selectedValue: any) {
      this.selectedCategoryId = selectedValue;
      this.loadMenu();
    }

    loadChart() {
      const totalStock = this.calculateTotalStock();
      const data = {
        labels: this.filteredMenus.map(menu => menu.item),
        datasets: [{
          label: 'Stock',
          data: this.filteredMenus.map(menu => menu.stock), // Calculate percentage of total stock
          backgroundColor: this.getRandomColors(this.filteredMenus.length), // Generate random colors for each menu
          hoverOffset: 20
        }]
      };

      // Render doughnut chart
      const ctx = document.getElementById('menuStockChart') as HTMLCanvasElement;
      if (this.menuStockChart) {
        this.menuStockChart.destroy();
        this.menuStockChart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
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
      else {
        this.menuStockChart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
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
    }

    calculateTotalStock(): number {
      return this.menus.reduce((total, menu) => total + menu.stock, 0);
    }

    getRandomColors(count: number): string[] {
      this.colors = [];
      const minRed = 255; // Minimum red value (to create yellow)
      const maxRed = 255; // Maximum red value (to create red)
      const minGreen = 0; // Minimum green value (to create yellow)
      const maxGreen = 255; // Maximum green value (to create yellow)
      const alpha = 0.6; // Alpha value for transparency
    
      for (let i = 0; i < count; i++) {
          const red = Math.floor(Math.random() * (maxRed - minRed + 1)) + minRed; // Generate random red value
          const green = Math.floor(Math.random() * (maxGreen - minGreen + 1)) + minGreen; // Generate random green value
          this.colors.push(`rgba(${red}, ${green}, 0, ${alpha})`); // Add the color to the array
      }
      console.log("ningnong", this.colors)
      return this.colors;
  }


    loadTotalRevData() {
      this.loadDataService.getTotalRev().subscribe({
        next: (res) => {
          if (res && res.data) {
            this.totalRev = res.data;
            console.log("Total Rev Data", this.totalRev);
            this.renderMonthlyQuantityChart();
            this.renderMonthlyPriceChart();
            this.calculateTotalRevenueForMonth();
            this.calculateSalesPerProduct(); 
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
    
      const labels = monthlyData.map(data => {
        const monthIndex = data.month - 1; // Months are zero-indexed in JavaScript Date objects
        const monthAbbreviation = new Date(2022, monthIndex).toLocaleString('default', { month: 'short' });
        return `${monthAbbreviation}`;
      });
      
      const totalQuantityData = monthlyData.map(data => data.totalQuantity);
      
    
      const ctx = document.getElementById('monthlyQuantityChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Sold Items (2024)',
              data: totalQuantityData,
              borderColor: 'rgba(75, 192, 192, 1)',
              barThickness: 10,
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
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Sales',
              data: totalPriceData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
              ]
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