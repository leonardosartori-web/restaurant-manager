import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {TablesComponent} from "./components/tables/tables.component";
import {GuardService} from "./services/guard.service";
import {OrdersComponent} from "./components/orders/orders.component";
import {MenuComponent} from "./components/menu/menu.component";
import {StaffComponent} from "./components/staff/staff.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {StatisticComponent} from "./components/statistic/statistic.component";


const routes : Routes = [
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "tables", component: TablesComponent, canActivate: [GuardService]},
  {path: "orders", component: OrdersComponent, canActivate: [GuardService]},
  {path: "menu", component: MenuComponent, canActivate: [GuardService]},
  {path: "staff", component: StaffComponent, canActivate: [GuardService]},
  {path: "statistics", component: StatisticComponent, canActivate: [GuardService]},
  {path: "profile", component: ProfileComponent, canActivate: [GuardService]},
  {path: '**', redirectTo: "/login", pathMatch: "full"}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
