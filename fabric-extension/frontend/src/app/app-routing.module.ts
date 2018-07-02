import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AccountsComponent } from './views/accounts/accounts.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
