import { Component, OnInit } from '@angular/core';
import { ManageUserService } from '../../../services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { Address, Membership, editUser, genAddress, getAllUser, userName, userStatus } from '../../../models/manage-user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})

export class ManageUserComponent implements OnInit {
  users: getAllUser[] = [];
  userNames: { cusName: number; firstName: string; middleName: string; lastName: string; }[] = [];
  memberShips: { userMembership: number; membership: string; } [] = [];
  genaddRess: { userAddress: number; email: string } [] = [];
  userStatus: { userStatus: number; status: string } [] = [];
  modalOpen: boolean = false;
  editedUser: editUser = {} as editUser

  constructor(
      private manageUserService: ManageUserService,
      private customerService: CustomerService,
      private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
      this.getAllUsers();
  }

  openEditModal(user: any) {
      this.modalOpen = true;
      this.editedUser = { 
          firstName: this.getUserFirstName(user.cusName),
          middleName: this.getUserMiddleName(user.cusName),
          lastName: this.getUserLastName(user.cusName),
          membership: this.getMembership(user.membership),
          address: this.getAddress(user.cusAddress),
          status: this.getUserStatus(user.status)
      };
  }

  updateUser() {
    this.modalOpen = false;
  }

  cancelEdit() {
    this.modalOpen = false;
  }

  getAllUsers() {
    this.manageUserService.getAllUser().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.users = res.data;
          this.toastr.success('Received Customer Details');
          this.loadCustomerName();
          this.loadMembership();
          this.loadAddress();
          this.loadUserStatus();
         

          if (this.users && this.users.length > 0) {
            this.users.forEach(usersList => {
              if (usersList && usersList) {
                usersList.customerId
                usersList.cusCredentials
                usersList.cusName
                usersList.membership
                usersList.cusAddress
                usersList.status
              } 
            });
          }
        }});
      }

      loadCustomerName() {
        this.users.forEach(user => {
          this.customerService.getCustomerName(user.cusName).subscribe({
            next: (res) => {
              this.userNames.push({ cusName: user.cusName, firstName: res.data.firstName, middleName: res.data.middleName, lastName: res.data.lastName });
            },
            error: (error) => {
              console.error('Error loading Customer Name:', error);
            }
          });
        });
      }

      loadMembership(){
        this.users.forEach(user => {
          this.manageUserService.getMembershipById(user.membership).subscribe({
            next: (res) => {
              this.memberShips.push({userMembership: user.membership, membership: res.data.membership})
            },
            error: (error) => {
              console.error('Error loading Membership Name:', error);
            }
          })
        })
      }

      loadAddress(){
        this.users.forEach(user => {
          this.manageUserService.getAddressById(user.cusAddress).subscribe({
            next: (res) => {
              this.genaddRess.push({userAddress: user.cusAddress, email: res.data.email })
            },
            error: (error) => {
              console.error('Error loading Address:', error);
            }
          })
        })
      }

      loadUserStatus(){
        this.users.forEach(user => {
          this.manageUserService.getUserStatusId(user.status).subscribe({
            next: (res) => {
              this.userStatus.push({userStatus: user.status, status: res.data.status })
            },
            error: (error) => {
              console.error('Error loading UserStatus:', error);
            }
          })
        })
      }
      
      getUserFirstName(cusName: number): string {
        const user = this.userNames.find(u => u.cusName === cusName);
        return user ? user.firstName : '';
      }
      
      getUserMiddleName(cusName: number): string {
        const user = this.userNames.find(u => u.cusName === cusName);
        return user ? user.middleName : '';
      }

      getUserLastName(cusName: number): string {
        const user = this.userNames.find(u => u.cusName === cusName);
        return user ? user.lastName : '';
      }

      getMembership(userMembership: number): string {
        const user = this.memberShips.find(u => u.userMembership === userMembership);
        return user ? user.membership : '';
      }

      getAddress(userAddress: number): string {
        const user = this.genaddRess.find(u => u.userAddress === userAddress);
        return user ? user.email : '';
      }

      getUserStatus(userStatus: number): string {
        const user = this.userStatus.find(u => u.userStatus === userStatus);
        return user ? user.status : '';
      }
}
