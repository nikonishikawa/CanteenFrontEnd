import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Address } from '../../../models/manage-address.model';
import { ManageAddressService } from '../../../services/manage-address.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-address.component.html',
  styleUrl: './manage-address.component.css'
})
export class ManageAddressComponent implements OnInit {
  address: Address[] = [];

  constructor(
    private manageAddressService: ManageAddressService,
    private router: Router,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.loadAddress();
  }


  loadAddress() {
    this.manageAddressService.getAllAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
          console.log("load address", this.address)
        }
      },
      error: (error) => {
        console.error('Error fetching address:', error);
      }
    });
  }
}
