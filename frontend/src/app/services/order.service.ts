import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {catchError, Observable, tap} from "rxjs";
import {Order} from "../models/Order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http : HttpClient, private userService : UserService) {}

  post_order(data: Object): Observable<Order> {
    return this.http.post<Order>(this.userService.url + '/orders', data, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  create_order(tableNum:number): Observable<Order> {
    const default_order : Order = {productionTime: new Date(), products: [], table: tableNum, waiter: "", _id: ""};
    return this.post_order(default_order);
  }

  delete_order(id: any): Observable<Order> {
    return this.http.delete<Order>(this.userService.url + '/orders/' + id, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  delete_product_from_order(order_id: string, product_id: string): Observable<Order> {
    return this.http.delete<Order>(this.userService.url + '/orders/' + order_id + '/products/' + product_id, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  set_order(id: any, data: Object): Observable<Order> {
    return this.http.put<Order>(this.userService.url + '/orders/' + id, data, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }

  set_product_of_order(order_id: string, product_id: string, data: Object): Observable<Order> {
    return this.http.put<Order>(this.userService.url + '/orders/' + order_id + '/products/' + product_id, data, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }

  get_orders(tableNum: any): Observable<Order[]> {
    let route: string = `${this.userService.url}/orders`;
    if (tableNum)
      route = `${this.userService.url}/tables/${tableNum}/orders`;
    return this.http.get<Order[]>(route, this.userService.options({})).pipe(
      tap( (data) => {
        // console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    );
  }

  get_order(order_id: string): Observable<Order> {
    return this.http.get<Order>(this.userService.url + '/orders/' + order_id, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }
}
