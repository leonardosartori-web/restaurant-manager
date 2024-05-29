import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  private static routes: any = {
    'Cashier': ['tables', 'staff', 'menu', 'statistics', 'orders', 'profile'],
    'Waiter': ['tables', 'menu', 'profile', 'orders'],
    'Cook': ['orders', 'profile'],
    'Bartender': ['orders', 'profile']
  }

  constructor(private router: Router, private us: UserService, private http: HttpClient, private jhs: JwtHelperService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (state.url !== '/login') {
      if (!this.us.is_authenticated()) {
        this.router.navigate(["login"]);
        return false;
      }
      else if (!GuardService.routes[this.us.get_role()].includes(state.url.split('/')[1])) {
        this.router.navigate(["**"]);
        return false;
      }
      else return true;
    }
    else return true;
  }
}
