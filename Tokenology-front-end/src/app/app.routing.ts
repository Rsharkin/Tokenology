import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { SignupHomeComponent } from './signup-home/signup-home.component';
import { UpdatePasswordComponent } from './updatePassword/updatePassword.component';
import {rootComponent} from './dashboard/error404/error404.component';

export const AppRoutes: Routes = [
    
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'signupHome',
        component: SignupHomeComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {  
        path: 'updatePassword',
        component: UpdatePasswordComponent 
    },
    { 
      path: 'dashboard', 
      loadChildren: 'app/sidebar/sidebar.module#SidebarModule' , 
    },

    { path: '404', 
     component: rootComponent
    },

    { path: '**', 
    redirectTo: '/' + '404'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules });
