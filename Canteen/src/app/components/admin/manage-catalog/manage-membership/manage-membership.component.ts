import { Component, OnInit } from '@angular/core';
import { MembershipDto } from '../../../../models/manage-catalog.model';
import { ManageMembershipService } from '../../../../services/manage-membership.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadDataService } from '../../../../services/load-data.service';
import { UserStatus } from '../../../../models/load-data.model';

@Component({
  selector: 'app-manage-membership',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-membership.component.html',
  styleUrl: './manage-membership.component.css'
})
export class ManageMembershipComponent implements OnInit {
  membership: MembershipDto[] = [];
  addMembership: MembershipDto = {} as MembershipDto;
  onMembership: MembershipDto = {} as MembershipDto;
  addMembershipModal: boolean = false;
  editMembershipModal: boolean = false;
  loadUser: UserStatus[] = [];

  constructor(
    private manageMembershipService: ManageMembershipService,
    private loadDataService: LoadDataService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadMembership();
    this.loadStatus();
  }

  openModal(): void {
    this.addMembershipModal = true; 
  }

  closeModal(): void {
    this.addMembershipModal = false;
    this.editMembershipModal = false;
  }

  loadMembership(): void {
    this.manageMembershipService.getAllMembership().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.membership = res.data;
          console.log('load Membership', this.membership);
        }
      },
      error: (error) => {
        console.error('Error fetching Membership:', error);
      }
    });
  }

  onMembershipRegistration(): void {
    this.manageMembershipService.addMembership(this.addMembership).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Membership Registration Successful');
          this.addMembershipModal = false;
          this.loadMembership();
        } else {
          alert(res && res.message ? res.message : 'Membership Registration failed');
        }
      },
      error: (error) => {
        console.error('Membership Registration failed:', error);
        this.toastr.error('An error occurred during Membership Registration');
      }
    });
  }

  openEditMembershipModal(Membership: MembershipDto): void {
    this.onMembership = { ...Membership };
    this.editMembershipModal = true; 
  }

  saveMembership() {
    const updateMembership: MembershipDto = {
      memberShipId: this.onMembership.memberShipId,
      membership: this.onMembership.membership,
      loyaltyPoints: this.onMembership.loyaltyPoints,
      status: this.onMembership.status
    };

    this.manageMembershipService.editMembership(updateMembership).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Data updated successfully');
          this.editMembershipModal = false;
          this.loadMembership();
          this.loadStatus();
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

  deleteMembership(membershipId: number): void {
    this.manageMembershipService.deleteMembership(membershipId).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.warning('Membership Deletion Successful');
          this.loadMembership();
        } else {
          alert(res && res.message ? res.message : 'Membership Deletion failed');
        }
      },
      error: (error) => {
        console.error('Membership Deletion failed:', error);
        this.toastr.error('An error occurred during Membership Deletion');
      }
    });
  }

  
  loadStatus(): void {
    this.loadDataService.getUserStatus().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.loadUser = res.data;
          console.log('Received Status data:', res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching Status data:', err);
      }
    });
  }
}

