import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/Product";
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  public foods : Product[] | any[] = [];
  public drinks : Product[] | any[] = [];
  public table_headers: string[] = ["name"];
  public add_product_data = {name: "", kind: "", price: 0.0};
  public update_product_data = {price: 0.0};
  public errmessage: any = undefined;
  public current_product: Product = {_id: "", kind: "", name: "", price: 0};

  constructor(private menuService : MenuService) {}

  ngOnInit(): void {
    this.get_menu();
  }

  public set_current_product(product: Product): void {
    this.current_product = product;
    this.update_product_data.price = this.current_product.price;
  }

  public get_menu(): void {
    this.menuService.get_products().subscribe({
      next: (products) => {
        let drinks: any[] = [];
        let foods: any[] = [];
        products.forEach(p => {
          p.kind === "Food" ? foods.push(p) : drinks.push(p);
        });
        this.foods = foods;
        this.drinks = drinks;
      },
      error: (error) => {
        console.log("Error while getting products");
      }
    })
  }

  public add_product(): void {
    if ((this.add_product_data.kind !== "Food" && this.add_product_data.kind !== "Drink") ||
      this.add_product_data.name.replaceAll(" ", "") === "") {
      this.errmessage = "Invalid data";
    }
    else this.menuService.post_product(this.add_product_data).subscribe({
      next: (product) => {
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  public update_product(): void {
    this.menuService.set_product(this.current_product.name, this.update_product_data).subscribe({
      next: value => {
        window.location.reload();
      },
      error: err => {
        this.errmessage ="Error";
        console.log(err);
      }
    })
  }

  public delete_product(): void {
    this.menuService.delete_product(this.current_product.name).subscribe({
      next: value => {
        window.location.reload();
      },
      error: err => {
        this.errmessage ="Error";
        console.log(err);
      }
    })
  }

}
