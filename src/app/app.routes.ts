import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

import { TaskListComponent } from './components/task-list/task-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

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
    path: 'task',
    component: TaskListComponent
  }
,
{
  path:'dashboard', component:DashboardComponent
},
{ 
    path: 'profile', 
    component: ProfileSettingsComponent 
  }
];