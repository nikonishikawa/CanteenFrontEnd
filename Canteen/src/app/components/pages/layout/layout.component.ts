import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {}