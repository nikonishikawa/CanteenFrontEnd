import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from '../../../models/login.model';
import { LoginService } from '../../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 

  loginUser: Login = new Login();

  constructor(private route: ActivatedRoute, private loginService: LoginService, private router: Router) {}

  onLogin() {
    this.loginService.SignIn(this.loginUser).subscribe((res: any) => {
      if (res.isSuccess) {
        alert('Login successful'); 
        localStorage.setItem('loginToken', res.data.userToken); 
        this.router.navigateByUrl('/dashboard');
      } else {
        alert(res.message);
      }
    });
  }
}
