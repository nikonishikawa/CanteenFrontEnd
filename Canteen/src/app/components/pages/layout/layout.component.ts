import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA], // Add NO_ERRORS_SCHEMA to schemas
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isActive!: number | 0;

  constructor(private layoutService: LayoutService, private router: Router) {}

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
}
