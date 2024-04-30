import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login, LoginResponse } from '../../../models/login.model';
import { LoginService } from '../../../services/login.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginUser: Login = {} as Login;
  toaster=inject(ToastrService);
  
  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.SignIn(this.loginUser).subscribe((res: LoginResponse) => {
      if (res.isSuccess) {
        localStorage.setItem('loginToken', res.data.userToken); 
        this.toaster.success('Login successful'); 
  
        const roleName = res.data.userRole[0];
        this.redirectBasedOnRole(roleName);
      } else {
        this.toaster.error(res.message);
      }
    });
  }
  
  redirectBasedOnRole(roleName: string) {
    switch (roleName) {
      case 'User':
        this.router.navigateByUrl('layout/dashboard'); 
        break;
      case 'Admin':
        this.router.navigateByUrl('dashboard'); 
        break;
      case 'Editor':
        this.router.navigateByUrl('layout/editor-dashboard'); 
        break;
      default:
        this.toaster.error('Invalid user role');
    }
  }
  
}