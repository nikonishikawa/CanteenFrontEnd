import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Address } from '../../../models/manage-address.model';
import { ManageAddressService } from '../../../services/manage-address.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.css']
})

export class ManageAddressComponent implements OnInit {
  address: Address[] = [];
  onAddress: Address = {} as Address;
  isModalOpen: boolean = false;

  constructor(
    private manageAddressService: ManageAddressService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAddress();
  }

  openAddAddressModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addAddress(onAddress: Address) {
    if (onAddress) {
      this.onAddress = {
        addressId: onAddress.addressId,
        barangay: onAddress.barangay,
        region: onAddress.region,
        postalCode: onAddress.postalCode
      };
      this.openAddAddressModal();
    }
  }

  submitAddress() {
    this.manageAddressService.addAddress(this.onAddress).subscribe(
      response => {
        this.toastr.success("Added Item Successfully!");
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
    this.closeModal();
  }

  loadAddress() {
    this.manageAddressService.getAllAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
          console.log("load address", this.address);
        }
      },
      error: (error) => {
        console.error('Error fetching address:', error);
      }
    });
  }
}

