import { Injectable } from '@angular/core';
import {catchError, Observable, tap} from "rxjs";
import {Product} from "../models/Product";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http : HttpClient, private userService : UserService) {}

  get_products(): Observable<Product[]> {
    return this.http.get<Product[]>(this.userService.url + '/products', this.userService.options({})).pipe(
      tap( (data) => {
        //console.log(JSON.stringify(data));
      }),
      catchError(this.userService.handleError)
    );
  }

  post_product(data: any): Observable<Product> {
    return this.http.post<Product>(this.userService.url + '/products', data, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }

  set_product(name: string, data: Object): Observable<Product> {
    return this.http.put<Product>(this.userService.url + '/products/' + name, data, this.userService.options({})).pipe(
      catchError(this.userService.handleError)
    )
  }

  delete_product(name: string): Observable<Product> {
    return this.http.delete<Product>(this.userService.url + '/products/' + name, this.userService.options()).pipe(
      catchError(this.userService.handleError)
    );
  }
}
