import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { StartpageComponent } from './startpage/startpage.component';
import { UserStartpageComponent } from './user-startpage/user-startpage.component';
import { DuelOverviewComponent } from './duel-overview/duel-overview.component';
import { DuelPlayComponent } from './duel-play/duel-play.component';
import { QuestionComponent } from './duel-play/question/question.component';
import { AnswersComponent } from './duel-play/answers/answers.component';
import { ModalNewDuelComponent } from './modal-new-duel/modal-new-duel.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    FooterComponent,
    StartpageComponent,
    UserStartpageComponent,
    DuelOverviewComponent,
    DuelPlayComponent,
    QuestionComponent,
    AnswersComponent,
    ModalNewDuelComponent,
    DataPrivacyComponent,
    LegalNoticeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
