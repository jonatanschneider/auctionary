import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarComponent } from './components/fragments/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionCreatePageComponent } from './components/pages/auction-create-page/auction-create-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuctionDetailsComponent } from './components/fragments/auction-details/auction-details.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogButtonComponent } from './components/fragments/log-button/log-button.component';
import { AuctionListPageComponent } from './components/pages/auction-list-page/auction-list-page.component';
import { AuctionListItemComponent } from './components/fragments/auction-list-item/auction-list-item.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { BidDialogComponent } from './components/dialogs/bid-dialog/bid-dialog.component';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { DataStoreService } from './services/util/data-store.service';
import { DashboardPageComponent } from './components/pages/dashboard-page/dashboard-page.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'logout',
    component: LogButtonComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'profile/:userId',
    component: LoginPageComponent
  },
  {
    path: 'auctions',
    component: AuctionListPageComponent
  },
  {
    path: 'auctions/new',
    canActivate: [AuthenticationGuard],
    component: AuctionCreatePageComponent
  },
  {
    path: 'auctions/:id',
    component: AuctionDetailsComponent
  },
  {
    path: 'auctions/:id/bid',
    canActivate: [AuthenticationGuard],
    component: AuctionDetailsComponent,
    data: {dialog: true}
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ToolbarComponent,
    AuctionDetailsComponent,
    LoginPageComponent,
    LogButtonComponent,
    AuctionCreatePageComponent,
    AuctionListPageComponent,
    AuctionListItemComponent,
    LoginPageComponent,
    BidDialogComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false
      }
    )
  ],
  entryComponents: [
    AuctionDetailsComponent,
    BidDialogComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    AuthenticationGuard,
    AuthenticationInterceptor,
    DataStoreService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
