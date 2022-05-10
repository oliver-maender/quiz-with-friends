import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { NoAuthGuard } from './auth/no-auth.guard';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { DuelOverviewComponent } from './duel-overview/duel-overview.component';
import { DuelPlayComponent } from './duel-play/duel-play.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { StartpageComponent } from './startpage/startpage.component';
import { UserStartpageComponent } from './user-startpage/user-startpage.component';

const routes: Routes = [
  { path: 'get-started', component: StartpageComponent },
  { path: 'data-privacy', component: DataPrivacyComponent },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'duel/:id/play', component: DuelPlayComponent, canActivate: [AuthGuard] },
  { path: 'duel/:id', component: DuelOverviewComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent, canActivate: [NoAuthGuard] },
  { path: '', component: UserStartpageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
