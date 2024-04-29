import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';
import { Router, RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA], 
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isActive!: number | 0;

  constructor(private layoutService: LayoutService,
              private router: Router, 
              private menuService: MenuService,
              private toastr: ToastrService,) {}

  ngOnInit() {
    this.isActive = this.layoutService.getActiveIndex();
  }

  toggleActive(index: number) {
    this.isActive = index === this.isActive ? 0 : index;
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
