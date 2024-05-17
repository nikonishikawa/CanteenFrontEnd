import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { Admin } from '../../../models/admin.model';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { UpdateVendorDto } from '../../../models/load-data.model';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [NO_ERRORS_SCHEMA], 
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.css'
})
export class VendorLayoutComponent implements OnInit {
  isActive!: number | 1;
  isSubActive!: number | 1;
  vendor: UpdateVendorDto = {} as UpdateVendorDto;

  constructor(private layoutService: LayoutService,
              private router: Router, 
              private vendorService: VendorService,
              private toastr: ToastrService,) {}

  ngOnInit() {
    this.isActive = this.layoutService.getActiveIndex();
    this.loadVendorData();
    this.navigateTo('vendor-dashboard', 1);
  }

  toggleActive(index: number) {
    this.isActive = index;
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

  loadVendorData() {
    this.vendorService.loadVendorData().subscribe({
      next: (res) => {
        this.vendor = res.data;
        console.log("vendor data", res.data);
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