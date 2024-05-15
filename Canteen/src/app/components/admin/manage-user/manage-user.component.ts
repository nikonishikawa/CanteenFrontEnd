import { Component, OnInit } from '@angular/core';
import { ManageUserService } from '../../../services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { Address, editUser, genAddress, getAllCustomer, getAllUser, getUser, userName, userStatus } from '../../../models/manage-user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Register } from '../../../models/register.model';
import { RegisterService } from '../../../services/register.service';
import { LoadDataService } from '../../../services/load-data.service';
import { UserStatus, Membership, UpdateCustomerDto } from '../../../models/load-data.model';
import { ApiResponseMessage } from '../../../models/apiresponsemessage.model';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})

export class ManageUserComponent implements OnInit {
  users: getAllCustomer[] = [];
  getUser: getAllCustomer = {} as getAllCustomer
  registernUser: Register = new Register();
  address: Address[] = [];
  loadUser: UserStatus[] = [];
  loadMem: Membership[] = [];
  modalOpen: boolean = false;
  modalUserOpen: boolean = false;
  editedUser: getAllCustomer = {} as getAllCustomer

  constructor(
      private manageUserService: ManageUserService,
      private customerService: CustomerService,
      private toastr: ToastrService,
      private registerService: RegisterService,
      private loadDataService: LoadDataService,
  ) { }

  ngOnInit(): void {
      this.getAllUsers();
      this.loadAllAddress();
      this.loadMemb();
      this.loadStatus();
  }

  openEditModal(getUser: getAllCustomer) {
      this.modalOpen = true;
      this.editedUser = { ...getUser };
  }

  saveCustomer() {
    const updateCustomerDto: UpdateCustomerDto = {
      customerId: this.editedUser.customerId,
      firstName: this.editedUser.firstName,
      middleName: this.editedUser.middleName,
      lastName: this.editedUser.lastName,
      membershipId: this.editedUser.membershipId,
      statusId: this.editedUser.statusId,
      addressId: this.editedUser.addressId,
      phoneNumber: this.editedUser.contactNumber,
      email: this.editedUser.email
    };

    this.manageUserService.updateCustomer(updateCustomerDto).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Customer updated successfully');
          this.modalOpen = false;
          this.getAllUsers();
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

  updateUser() {
    this.modalOpen = false;
  }

  cancelEdit() {
    this.modalOpen = false;
  }


  addUserModal() {
    this.modalUserOpen = true;
    
  }
  closeModal() {
    this.modalUserOpen = false;
  }


  getAllUsers() {
    this.manageUserService.getAllUser().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.users = res.data;
          this.toastr.success('Received Customer Details');
          console.log(res)
        }});
      }

      onRegister() {
        this.registerService.RegisterIn(this.registernUser).subscribe(
          (res) => {
            if (res && res.isSuccess) {
              this.toastr.success('Registration Successful'); 
              this.modalUserOpen = false;
              this.getAllUsers();
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
            console.log('Received address data:', res.data);
          }
        },
        error: (err) => {
          console.error('Error fetching address data:', err);
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

    loadMemb(): void {
      this.loadDataService.getMembership().subscribe({
        next: (res) => {
          if (res && res.data) {
            this.loadMem = res.data;
            console.log('Received Membership data:', res.data);
          }
        },
        error: (err) => {
          console.error('Error fetching Membership data:', err);
        }
      });
    }
}
