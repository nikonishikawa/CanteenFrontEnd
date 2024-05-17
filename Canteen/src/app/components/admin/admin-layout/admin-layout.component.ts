import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { Admin } from '../../../models/admin.model';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

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
  isSubActive!: number | 1;
  admins: Admin[] = [];
  admin: Admin = {} as Admin;

  constructor(private layoutService: LayoutService,
              private router: Router, 
              private menuService: MenuService,
              private toastr: ToastrService,
              private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdminData();
    this.isActive = this.layoutService.getActiveIndex();
  }

  toggleActive(index: number) {
    this.isActive = index === 8 ? 1 : (index === this.isActive ? 1 : index);
    this.isSubActive = 1;
    this.toggleSubActive(1);
    this.layoutService.setActiveIndex(this.isActive);
  }
  
  toggleSubActive(index: number) {
    this.isSubActive = index;
  }

  navigateTo(route: string, index: number) {
    this.router.navigate([route]);
    this.toggleActive(index);
  }

  loadAdminData() {
    this.adminService.loadCustomerData().subscribe({
      next: (res) => {
        this.admin = res.data;
      }
    });
  }

  menu() {
    this.toastr.success('Moving to menu');
    
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.toastr.success('Logged Out Successfully');
    
  }
}
