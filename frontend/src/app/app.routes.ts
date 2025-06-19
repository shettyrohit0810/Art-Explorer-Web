// frontend\src\app\modal.service.ts
import { Routes } from '@angular/router';
import { SearchComponent } from './artist/search/search.component';
// Assume you have LoginComponent and RegisterComponent defined
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Wildcard route for a 404 page (optional)
  { path: '**', redirectTo: '/search' }
];
