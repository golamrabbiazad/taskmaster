import { Routes } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    canActivate: [authGuard],
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
];
