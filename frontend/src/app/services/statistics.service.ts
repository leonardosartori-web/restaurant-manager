import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {catchError, Observable, tap} from "rxjs";
import {Statistic} from "../models/Statistic";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http : HttpClient, private userService : UserService) { }

  public get_statistics_users(): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(this.userService.url + '/statistics/users', this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    )
  }

  public get_statistics_orders(): Observable<any[]> {
    return this.http.get<any[]>(this.userService.url + '/statistics/orders', this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    )
  }

  public get_statistics_tables(): Observable<any[]> {
    return this.http.get<any[]>(this.userService.url + '/statistics/tables', this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    )
  }
}
