import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { LayoutComponent } from './components/pages/layout/layout.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { MenuComponent } from './components/pages/menu/menu.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'register',
        component: RegisterComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children: [{
            path:'dashboard',
            component: DashboardComponent
        }]
    },
    {
        path:'menu',
        component: MenuComponent
        
    },
    {
        path:'**',
        component:LoginComponent
    },
  
];
