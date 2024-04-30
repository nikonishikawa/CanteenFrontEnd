import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { LayoutComponent } from './components/pages/layout/layout.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { MenuComponent } from './components/pages/menu/menu.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AddMenuComponent } from './components/pages/menu/add-menu/add-menu.component';
import { TransactionComponent } from './components/pages/transaction/transaction.component';
import { OrderComponent } from './components/pages/order/order.component';
import { AuthGuard } from './AuthInterceptor/authGuard';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';
import { ManageUserComponent } from './components/admin/manage-user/manage-user.component';

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
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: AdminProfileComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**', 
    redirectTo: 'login'
  }
];