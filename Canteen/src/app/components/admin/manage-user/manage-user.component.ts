import { Component, OnInit } from '@angular/core';
import { ManageUserService } from '../../../services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { getAllUser, userName } from '../../../models/manage-user.model';
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
  userName: userName = {}  as userName;
  userNames: { cusName: string; firstName: string }[] = [];


  constructor(
    private manageUserService: ManageUserService,
    private customerService : CustomerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.manageUserService.getAllUser().subscribe(
      (res) => {
        if (res.isSuccess) {
          this.users = res.data;
          console.log("Response", res);

          this.loadCustomerName();

          if (this.users && this.users.length > 0) {
            this.users.forEach(usersList => {
              if (usersList && usersList) {
                console.log("customerId:", usersList.customerId);
                console.log("cusCredentials:", usersList.cusCredentials);
                console.log("cusName:", usersList.cusName);
                console.log("membership:", usersList.membership);
                console.log("cusAddress:", usersList.cusAddress);
                console.log("status:", usersList.status);
              } else {
                console.error("users data is undefined:", usersList);
              }
            });
          } else {
            console.error("users is empty or undefined");
          }
        } else {
          console.error('Error retrieving users:', res.message);
        }
      }
    );
  }

  loadCustomerName() {
    this.users.forEach(user => {
      this.customerService.getCustomerName(user.cusName).subscribe({
        next: (res) => {
          this.userName = res.data; 
          console.log('Received Customer Name:', res);
        },
        error: (error) => {
          console.error('Error loading Customer Name:', error);
        }
      });
    });
  }
}
