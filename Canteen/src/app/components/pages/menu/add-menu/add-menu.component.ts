import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../../models/menu.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../../services/menu.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-menu',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-menu.component.html',
  styleUrl: './add-menu.component.css'
})
export class AddMenuComponent implements OnInit {
  addMenuRequest: Menu = {} as Menu;
  menus: Menu[] = []; 
  filteredMenu: Menu[] = [];
  selectedCategory: number = 0;
  constructor(private route: ActivatedRoute, private router: Router, private menuService: MenuService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  addMenu() {
    try {
      this.menuService.addMenu(this.addMenuRequest)
        .subscribe({
          next: (menu) => {
            this.router.navigate(['Menu']);
          },
          error: (error) => {
            console.error('Error adding menu:', error);
          }
        });
    } catch (error) {
      console.error('Error adding menu:', error);
    }
  }
}
