import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
//import { HomeModule } from './components/home/home.module';
import { FacebookGuard } from './guards/facebook.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
   // loadChildren: ( () => import('./components/home/home.module').then(m => m.HomeModule)),
    canActivate: [FacebookGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
