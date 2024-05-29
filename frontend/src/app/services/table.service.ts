import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {catchError, Observable, tap} from "rxjs";
import {Table} from "../models/Table";


@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient, private userService: UserService) {}

  get_tables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.userService.url + "/tables", this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    );
  }

  set_table(number: number, data: Object): Observable<Table> {
    return this.http.put<Table>(this.userService.url + '/tables/' + number, data, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }

  get_table(number: number): Observable<Table> {
    return this.http.get<Table>(this.userService.url + '/tables/' + number, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }

  post_table(data: any): Observable<Table> {
    return this.http.post<Table>(this.userService.url + '/tables', data, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  delete_table(number: number): Observable<Table> {
    return this.http.delete<Table>(this.userService.url + '/tables/' + number, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }
}
