import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {Router} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './components/login/login.component';
import {UserService} from "./services/user.service";
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import { TablesComponent } from './components/tables/tables.component';
import {TableService} from "./services/table.service";
import {OrderService} from "./services/order.service";
import { OrdersComponent } from './components/orders/orders.component';
import { MenuComponent } from './components/menu/menu.component';
import {MenuService} from "./services/menu.service";
import { StaffComponent } from './components/staff/staff.component';
import { ProfileComponent } from './components/profile/profile.component';
import {GuardService} from "./services/guard.service";
import {SocketService} from "./services/socket.service";
import {StaffService} from "./services/staff.service";
import { StatisticComponent } from './components/statistic/statistic.component';
import {NgOptimizedImage} from "@angular/common";
import {StatisticsService} from "./services/statistics.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TablesComponent,
    OrdersComponent,
    NavbarComponent,
    MenuComponent,
    StaffComponent,
    ProfileComponent,
    StatisticComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        NgOptimizedImage
    ],
  providers: [
    {provide: UserService, useClass: UserService },
    {provide: TableService, useClass: TableService },
    {provide: OrderService, useClass: OrderService },
    {provide: MenuService, useClass: MenuService},
    {provide: StaffService, useClass: StaffService},
    {provide: GuardService, useClass: GuardService},
    {provide: SocketService, useClass: SocketService},
    {provide: StatisticsService, useClass: StatisticsService},
    {provide: JwtHelperService, useClass: JwtHelperService },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
  }
}
