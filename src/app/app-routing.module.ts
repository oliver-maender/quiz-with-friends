import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { StartpageComponent } from './startpage/startpage.component';
import { UserStartpageComponent } from './user-startpage/user-startpage.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'get-started', component: StartpageComponent },
  { path: '', component: UserStartpageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
