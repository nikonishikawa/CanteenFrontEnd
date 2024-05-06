import { Component, OnInit, inject } from '@angular/core';
import { Register } from '../../../models/register.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../services/register.service';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../models/manage-user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  toaster=inject(ToastrService);
  registernUser: Register = new Register();
  address: Address[] = [];

  constructor(private route: ActivatedRoute, private registerService: RegisterService, private router: Router) {}
  ngOnInit(): void {
    this.loadAddress();
  }

  onRegister() {
    this.registerService.RegisterIn(this.registernUser).subscribe(
      (res: any) => {
        if (res && res.isSuccess) {
          this.toaster.success('Registration Successful'); 
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

loadAddress(): void {
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


}  

// updated
