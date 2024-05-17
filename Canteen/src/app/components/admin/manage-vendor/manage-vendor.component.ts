import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../../services/register.service';
import { Register } from '../../../models/register.model';
import { Address, userStatus } from '../../../models/manage-user.model';
import { getAllVendor } from '../../../models/manage-vendor.model';
import { ManageVendorService } from '../../../services/manage-vendor.service';
import { LoadDataService } from '../../../services/load-data.service';
import { Membership, Position, UpdateVendorDto, UserStatus } from '../../../models/load-data.model';

@Component({
  selector: 'app-manage-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-vendor.component.html',
  styleUrl: './manage-vendor.component.css'
})

export class ManageVendorComponent implements OnInit {
  vendorRegister: Register = new Register();
  address: Address[] = [];
  vendors: getAllVendor[] = [];
  editedVendor: getAllVendor = {} as getAllVendor;
  modalVendorOpen: boolean = false;
  modalOpen: boolean = false;
  loadStat: UserStatus[] = [];
  loadMemb: Membership[] = [];
  loadPos: Position[] = [];

  constructor(
    private toastr: ToastrService,
    private registerService: RegisterService,
    private vendorService: ManageVendorService,
    private loadDataService: LoadDataService
  ) { }

  ngOnInit(): void {
    this.loadAllVendor();
    this.loadAllAddress();
    this.loadMember();
    this.loadStatus();
    this.loadPosition();
  }

  addVendorModal() {
    this.modalVendorOpen = true;
  }

  closeModal() {
    this.modalVendorOpen = false;
    this.modalOpen = false;
  }

  openEditModal(vendor: getAllVendor) {
    this.editedVendor = { ...vendor };
    this.modalOpen = true;
  }

  saveVendor() {
    const updateVendorDto: UpdateVendorDto = {
      vendorId: this.editedVendor.vendorId,
      firstName: this.editedVendor.firstName,
      middleName: this.editedVendor.middleName,
      lastName: this.editedVendor.lastName,
      positionId: this.editedVendor.positionId,
      statusId: this.editedVendor.statusId,
      addressId: this.editedVendor.addressId,
      phoneNumber: this.editedVendor.contactNumber,
      email: this.editedVendor.email
    };

    this.vendorService.updateVendor(updateVendorDto).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Vendor updated successfully');
          this.modalOpen = false;
          this.loadAllVendor();
        } else {
          alert(res && res.message ? res.message : 'Update failed');
        }
      },
      (error) => {
        console.error('Update failed:', error);
        this.toastr.error('An error occurred during the update');
      }
    );
  }

  onRegister() {
    this.registerService.RegisterVendor(this.vendorRegister).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Registration Successful');
          this.modalVendorOpen = false;
          this.loadAllVendor();
        } else {
          alert(res && res.message ? res.message : 'Registration failed');
        }
      },
      (error) => {
        console.error('Registration failed:', error);
        this.toastr.error('An error occurred during registration');
      }
    );
  }

  loadAllAddress(): void {
    this.registerService.getAddress().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.address = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching address data:', err);
      }
    });
  }

  loadAllVendor(): void {
    this.vendorService.getAllVendor().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.vendors = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching Vendor data:', err);
      }
    });
  }

  loadStatus(): void {
    this.loadDataService.getUserStatus().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.loadStat = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching Status data:', err);
      }
    });
  }

  loadMember(): void {
    this.loadDataService.getMembership().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.loadMemb = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching Membership data:', err);
      }
    });
  }

  loadPosition(): void {
    this.loadDataService.getPosition().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.loadPos = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching Position data:', err);
      }
    });
  }
}