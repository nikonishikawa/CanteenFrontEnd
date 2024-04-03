import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../../models/login.model';
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
  loginUser: Login = new Login();
  toaster=inject(ToastrService);
  
  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.SignIn(this.loginUser).subscribe((res: any) => {
      if (res.isSuccess) {
        this.toaster.success('Login successful'); 
        localStorage.setItem('loginToken', res.data.userToken); 
        this.router.navigateByUrl('dashboard');
      } else {
        this.toaster.error(res.message);
      }
    });
  }
}
