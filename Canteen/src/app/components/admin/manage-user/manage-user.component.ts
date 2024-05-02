import { Component, OnInit } from '@angular/core';
import { ManageUserService } from '../../../services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { getAllUser } from '../../../models/manage-user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {

  users: getAllUser[] = [];



  constructor(
    private manageUserService: ManageUserService,
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
}
