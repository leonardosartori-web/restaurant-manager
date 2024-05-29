import { Injectable } from '@angular/core';
import {Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import jwt_decode from "jwt-decode";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../models/User";

interface ReceivedToken {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string = "";
  public url = "https://restaurant-manage-api.netlify.app";
  public roles: string[] = ["Cashier", "Cook", "Bartender", "Waiter"];
  public dashboard_routes: any = {"Cashier": "/tables", "Waiter": "/tables", "Cook": "/orders", "Bartender": "/orders"};

  constructor(private http: HttpClient, private jhs: JwtHelperService, private router: Router) {
    console.log("User service instantiated");

    const localtoken = localStorage.getItem("restaurant_app_token");
    if (!localtoken || localtoken.length < 1) {
      console.log("No token found in local storage");
      this.token = "";
    } else {
      this.token = localtoken as string;
      console.log("JWT loaded from local storage");
    }
  }

  public options( params = {} ) {
    return  {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.get_token(),
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }),
      params: new HttpParams( {fromObject: params} )
    };
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }

    return throwError(() => new Error('Something bad happened; please try again later.') );
  }

  login(email: string, password: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(`${email}:${password}`),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get(this.url+"/login", options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
        this.token = (data as ReceivedToken).token;
        localStorage.setItem("restaurant_app_token", this.token as string);
      })
    );
  }

  logout(): void {
    console.log("Logging out");
    this.token = "";
    localStorage.setItem("restaurant_app_token", this.token);
    this.router.navigate(["/"]);
  }

  private isValidToken(token: string): boolean {
    return !(this.jhs.isTokenExpired(token));
  }

  is_authenticated(): boolean {
    return this.isValidToken(this.get_token());
  }

  get_token(): string {
    return this.token;
  }

  get_role(): string {
    if (this.is_authenticated())
      return (jwt_decode(this.token) as User).role;
    else return "";
  }

  get_email(): string {
    if (this.is_authenticated())
      return (jwt_decode(this.token) as User).email;
    else return "";
  }

  get_id(): string {
    return (jwt_decode(this.token) as User).id;
  }

  get_user(): User {
    return (jwt_decode(this.token) as User);
  }

}
