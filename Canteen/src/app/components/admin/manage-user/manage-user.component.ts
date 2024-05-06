import { Component, OnInit } from '@angular/core';
import { ManageUserService } from '../../../services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { Address, editUser, genAddress, getAllUser, getUser, userName, userStatus } from '../../../models/manage-user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Register } from '../../../models/register.model';
import { RegisterService } from '../../../services/register.service';
import { LoadDataService } from '../../../services/load-data.service';
import { UserStatus, Membership } from '../../../models/load-data.model';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})

export class ManageUserComponent implements OnInit {
  users: getAllUser[] = [];
  getUser: getUser = {} as getUser
  registernUser: Register = new Register();
  address: Address[] = [];
  loadUser: UserStatus[] = [];
  loadMem: Membership[] = [];
  userNames: { cusName: number; firstName: string; middleName: string; lastName: string; }[] = [];
  memberShips: { userMembership: number; membership: string; } [] = [];
  genaddRess: { userAddress: number; email: string } [] = [];
  userStatus: { userStatus: number; status: string } [] = [];
  modalOpen: boolean = false;
  modalUserOpen: boolean = false;
  editedUser: editUser = {} as editUser

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
  }

  openEditModal(getUser: getUser) {
      this.modalOpen = true;
      this.editedUser = { 
          firstName: this.getUserFirstName(getUser.cusName),
          middleName: this.getUserMiddleName(getUser.cusName),
          lastName: this.getUserLastName(getUser.cusName),
          membership: this.getMembership(getUser.membership),
          address: this.getAddress(getUser.cusAddress),
          status: this.getUserStatus(getUser.status)
      };
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
          this.loadCustomerName();
          this.loadMembership();
          this.loadAddress();
          this.loadUserStatus();
          this.loadStatus();
          this.loadMemb();
         

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
      
      onRegister() {
        this.registerService.RegisterIn(this.registernUser).subscribe(
          (res: any) => {
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
