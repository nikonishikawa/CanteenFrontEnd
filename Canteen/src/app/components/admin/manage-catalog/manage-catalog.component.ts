import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../models/manage-address.model';
import { ManageAddressService } from '../../../services/manage-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCategoryService } from '../../../services/manage-category.service';
import { CategoryDto } from '../../../models/manage-catalog.model';


@Component({
  selector: 'app-manage-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-catalog.component.html',
  styleUrl: './manage-catalog.component.css'
})

export class ManageCatalogComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}