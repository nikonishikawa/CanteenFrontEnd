import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { LayoutComponent } from './components/pages/layout/layout.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { MenuComponent } from './components/pages/menu/menu.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AddMenuComponent } from './components/pages/menu/add-menu/add-menu.component';
import { TransactionComponent } from './components/pages/transaction/transaction.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'layout', 
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
          path: 'menu',
          component: MenuComponent,
          children: [ 
          {
            path: 'add-menu',
            component: AddMenuComponent
          }
        ]
      },
      {
        path: 'transaction',
        component: TransactionComponent
      },
    ]
  },
  {
    path: '**', 
    redirectTo: 'login'
  }
];