import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj: any = {
    "username": "",
    "password": ""
  };

  registrationObj: any = { 
    "username": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('https://localhost:44343/api/UserCredential/LoginAccount', this.loginObj).subscribe((res: any) => {
      if (res.isSuccess) {
        alert('Login successful'); 
        localStorage.setItem('loginToken', res.data.userToken); 
        this.router.navigateByUrl('/dashboard');
      } else {
        alert(res.message);
      }
    });
  }

  onSignup() {
    this.http.post('https://localhost:44343/api/UserCredential/RegisterUser', this.registrationObj).subscribe((res: any) => {
      if (res.isSuccess) {
        alert('Registration successful');
        this.router.navigateByUrl('/login');
      } else {
        alert(res.message);
      }
    });
  }
}
