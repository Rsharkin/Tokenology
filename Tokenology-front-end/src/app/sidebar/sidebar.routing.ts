  import { ModuleWithProviders } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
  import { SidebarComponent } from './sidebar.component';
  import { DashboardComponent } from './../dashboard/dashboard.component';
  import { ViewUserComponent } from './../dashboard/UserList/view-user/view-user.component';
  import { MyProfileComponent } from './../dashboard/UserList/my-profile/my-profile.component';
  import { SettingComponent } from './../dashboard/UserList/setting/setting.component';
  import { HelpComponent } from './../dashboard/UserList/help/help.component';
  import { LoginComponent } from '../login/login.component';
   import { InvestIcoComponent } from './../dashboard/UserList/investIco/investIco.component';
  import { childComponent } from './../dashboard/error404/error404.component'; 
  import { AuthGuard } from './../auth-guard.service';


  const routes: Routes = [

    { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard], children: 
    [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'view-user', component: ViewUserComponent ,canActivate:[AuthGuard]},
    { path: 'my-profile', component: MyProfileComponent ,canActivate:[AuthGuard] },
    { path: 'setting', component: SettingComponent ,canActivate:[AuthGuard]},
    { path: 'help', component: HelpComponent,canActivate:[AuthGuard] },
    { path: 'investIco', component: InvestIcoComponent,canActivate:[AuthGuard] },
    { path: 'login', component:LoginComponent},    
    { path: '404', component: childComponent },
    { path: '**', component: childComponent},

    ]},
  ];

  //   const routes: Routes = [

  //   { path: 'dashboard', component: DashboardComponent ,canActivate:[AuthGuard], children: 
  //   [
  //   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //   { path: 'view-user', component: ViewUserComponent,canActivate:[AuthGuard] },
  //   { path: 'my-profile', component: MyProfileComponent,canActivate:[AuthGuard] },
  //   { path: 'setting', component: SettingComponent,canActivate:[AuthGuard] },
  //   { path: 'help', component: HelpComponent ,canActivate:[AuthGuard]},
  //   { path: 'login', component:LoginComponent},    
  //   { path: '404', component: childComponent},
  //   { path: '**', component: childComponent},

  //   ]},
  // ];


  export const routing: ModuleWithProviders = RouterModule.forChild(routes);
