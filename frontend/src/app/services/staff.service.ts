import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {catchError, Observable, tap} from "rxjs";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http : HttpClient, private userService : UserService) {}

  get_users(): Observable<User[]> {
    return this.http.get<User[]>(this.userService.url + '/users', this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    );
  }

  post_user(data: any): Observable<User> {
    return this.http.post<User>(this.userService.url + '/users', data, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  get_user(email: string): Observable<User> {
    return this.http.get<User>(this.userService.url + '/users/' + email, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    )
  }

  delete_user(email: string): Observable<User> {
    return this.http.delete<User>(this.userService.url + '/users/' + email, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  update_user(email: string, data: any): Observable<User> {
    return this.http.put<User>(this.userService.url + '/users/' + email, data, this.userService.options()).pipe(
    catchError(this.userService.handleError)
    );
  }
}
