import { Component, inject } from '@angular/core';
import { Register } from '../../../models/register.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../services/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  toaster=inject(ToastrService);
  registernUser: Register = new Register();

  constructor(private route: ActivatedRoute, private registerService: RegisterService, private router: Router) {}

  onRegister() {
    this.registerService.RegisterIn(this.registernUser).subscribe(
      (res: any) => {
        if (res && res.isSuccess) {
          this.toaster.success('Registration Successful'); 
          this.router.navigateByUrl('login');
        } else {
          alert(res && res.message ? res.message : 'Registration failed');
        }
      },
      (error) => {
        console.error('Registration failed:', error);
        this.toaster.error('An error occurred during registration');
      }
    );
  }
}  
