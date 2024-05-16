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
import { ManageMenuComponent } from './components/admin/manage-menu/manage-menu.component';
import { ManageOrderComponent } from './components/admin/manage-order/manage-order.component';
import { ManageCatalogComponent } from './components/admin/manage-catalog/manage-catalog.component';
import { ManageFoodCategoryComponent } from './components/admin/manage-catalog/manage-food-category/manage-food-category.component';
import { ManageAddressComponent } from './components/admin/manage-catalog/manage-address/manage-address.component';
import { ManageVendorComponent } from './components/admin/manage-vendor/manage-vendor.component';
import { ManagePositionComponent } from './components/admin/manage-catalog/manage-position/manage-position.component';
import { ManageMembershipComponent } from './components/admin/manage-catalog/manage-membership/manage-membership.component';
import { VendorLayoutComponent } from './components/vendor/vendor-layout/vendor-layout.component';
import { VendorDashboardComponent } from './components/vendor/vendor-dashboard/vendor-dashboard.component';
import { VendorOrderComponent } from './components/vendor/vendor-order/vendor-order.component';
import { VendorMenuComponent } from './components/vendor/vendor-menu/vendor-menu.component';
import { VendorProfileComponent } from './components/vendor/vendor-profile/vendor-profile.component';

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
        path: 'manage-order',
        component: ManageOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-vendor',
        component: ManageVendorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-menu',
        component: ManageMenuComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-catalog',
        component: ManageCatalogComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-catalog-category',
        component: ManageFoodCategoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-catalog-address',
        component: ManageAddressComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-catalog-position',
        component: ManagePositionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-catalog-membership',
        component: ManageMembershipComponent,
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
      }
    ]
  }, 
     {
      path: '', 
      component: VendorLayoutComponent,
      canActivate: [AuthGuard],
      children: [
        {
          path: 'vendor-dashboard',
          component: VendorDashboardComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'vendor-order',
          component: VendorOrderComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'vendor-menu',
          component: VendorMenuComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'vendor-profile',
          component: VendorProfileComponent,
          canActivate: [AuthGuard]
        }]
      },
  {
    path: '**', 
    redirectTo: 'login'
  }
];