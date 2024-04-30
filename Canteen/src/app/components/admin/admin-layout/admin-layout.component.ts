import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [NO_ERRORS_SCHEMA], 
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  isActive!: number | 1;

  constructor(private layoutService: LayoutService,
              private router: Router, 
              private menuService: MenuService,
              private toastr: ToastrService,) {}

  ngOnInit() {
    this.isActive = this.layoutService.getActiveIndex();
  }

  toggleActive(index: number) {
    this.isActive = index === 5 ? 1 : (index === this.isActive ? 1 : index);
    this.layoutService.setActiveIndex(this.isActive);
  }  

  navigateTo(route: string, index: number) {
    this.router.navigate([route]);
    this.toggleActive(index);
  }

  menu() {
    this.toastr.success('Moving to menu');
    
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.toastr.success('Logged Out Successfully');
    
  }

  // loadCategory() {
  //   this.menuService.getAllCaetegory().subscribe({
  //     next: (res) => {
  //       if (res && res.data) {
  //         console.log(res.data);
  //         this.category = res.data;
  //         this.filterMenu(0);
  //       }
  //     },
  //     error: (error) => {
  //     }
  //   });
  // }
}
