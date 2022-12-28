import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: "home", component: HomeComponent, canActivate: [AuthGuard],
    children: [
      {path: "employee", loadChildren: () => import('./employees/employees.module').then(mod => mod.EmployeesModule)}
    ]
  },
  {path: "login", component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
