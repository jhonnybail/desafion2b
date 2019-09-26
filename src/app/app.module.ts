import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './guards/AuthGuard';
import { AuthService } from './services/AuthService';
import { ListPostComponent } from './list-post/list-post.component';
import { TokenInterceptor } from "./core/TokenInterceptor";
import { EditPostComponent } from './edit-post/edit-post.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ListPostComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot(),
    routing,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  entryComponents: [
    EditPostComponent
  ],
  providers: [AuthGuard, AuthService, {provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
