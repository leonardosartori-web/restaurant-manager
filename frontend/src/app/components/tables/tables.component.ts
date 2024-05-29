import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {TableService} from "../../services/table.service";
import {UserService} from "../../services/user.service";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/Order";
import {MenuService} from "../../services/menu.service";
import {Product} from "../../models/Product";
import {SocketService} from "../../services/socket.service";
import * as html2pdf from "html2pdf.js";

interface Table {
  num: number,
  isOccupied: boolean,
  seats: number
  id: string
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit{
  public imagePath: string = "assets/img/dining-table.png";
  public tables : Table[] = [];
  public menu : Product[] = [];
  public filter_capacity: number = 0;
  public filtered_tables : Table[] = [];
  public current_table : Table = {num: 0, isOccupied: false, seats: 2, id: ""};
  public current_order : Order = {productionTime: new Date(), products: [], table: 0, waiter: "", _id: ""};
  public current_order_selected_product : Product = {_id: "", kind: "", name: "", price: 0};
  public add_table_data = {seats: 1, num: 0};
  public update_table_seats = 1;
  public errmessage: any = undefined;

  constructor(private tableService : TableService, private orderService : OrderService, private menuService : MenuService, private userService : UserService, private socketService : SocketService) {}

  ngOnInit(): void {
    this.get_socket_tables();
    this.get_tables();
    this.get_menu();
  }

  get_new_table_num(): number {
    return (this.tables.length + 1);
  }

  user_role(): string {
    return this.userService.get_role();
  }

  get_user_id(): string {
    return this.userService.get_id();
  }

  public get_tables(): void {
    this.tableService.get_tables().subscribe({
      next: (tables) => {
        this.tables = tables.sort((a, b) => a.num - b.num);
        this.get_filtered_tables();
        this.add_table_data.num = this.get_new_table_num();
      },
      error: (error) => {
        console.log('Error occured while getting: ' + error);
      }
    });
  }

  public get_filtered_tables(): void {
    this.filtered_tables = this.tables.filter(x => x.seats >= this.filter_capacity);
  }

  private get_socket_tables(): void {
    this.socketService.get_updates("updateTables").subscribe(() => {
      this.get_tables();
    });
  }

  private get_socket_order(): void {
    this.socketService.get_updates("updateOrders").subscribe(() => {
      this.get_current_table_order();
    })
  }

  public set_current_table(table:Table): void {
    this.current_table = table;
    this.update_table_seats = this.current_table.seats;
    this.get_current_table_order();
    this.get_socket_order();
  }

  public get_current_table_order(): void {
    this.orderService.get_orders(this.current_table.num).subscribe({
      next: (orders) => {
        if (orders.length > 0 && this.current_table.isOccupied) {
          orders = orders.sort((a, b) => new Date(b.productionTime).getTime() - new Date(a.productionTime).getTime());
          this.current_order = orders[0];
        }
      },
      error: (error) => {
        console.log('Error occurred while posting: ' + error);
      }
    });
  }

  public get_curr_table(): Table {
    return this.current_table;
  }

  public compute_bill(): number {
    const arr = this.current_order.products;
    return Number((arr.reduce((accumulator, value) => {
      return accumulator + value.price;
    }, 0)).toFixed(2));
  }

  public occupy(): void {
    this.current_table.isOccupied = true;
    this.update_table({isOccupied: true});
    this.orderService.create_order(this.current_table.num).subscribe({
      next: (order) => {
        this.current_order = order;
      },
      error: (error) => {
        console.log('Error occurred while posting: ' + error);
      }
    })
  }

  public remove_empty_order(): void {
    if (this.current_order.products.length <= 0) {
      this.orderService.delete_order(this.current_order._id).subscribe({
        next: () => {
          console.log("Order removed!");
        },
        error: () => {
          console.error("Error while deleting");
        }
      });
      this.free_table();
    }
  }

  public free_table(): void {
    this.current_table.isOccupied = false;
    this.update_table({isOccupied: false});
    this.current_order = {_id: "", productionTime: new Date, products: [], table: 0, waiter: ""};
  }

  public update_table(data: any): void {
    this.tableService.set_table(this.current_table.num, data).subscribe( {
      next: () => {
        console.log('Table status changed');
      },
      error: (error) => {
        console.log('Error occurred while posting: ' + error);
      }});
  }

  private get_menu(): void {
    this.menuService.get_products().subscribe({
      next: (products) => {
        products.push({_id: "", kind: "Food", price: 0, name: "------"});
        products.push({_id: "", kind: "Drink", price: 0, name: "------"});
        const values = ["Food", "Drink"];
        this.menu = products.sort((a:Product, b:Product) => {
          let kind_diff: number = values.indexOf(b.kind) - values.indexOf(a.kind);
          if (kind_diff === 0) return (b.name > a.name ? -1 : 1);
          else return kind_diff;
        })
      },
      error: (error) => {
        console.log('Error occurred while getting: ' + error);
      }
    })
  }

  public add_product_to_order(): void {
    const products = [this.current_order_selected_product];
    this.orderService.set_order(this.current_order._id, {products}).subscribe({
      next: () => {
        this.set_current_table(this.current_table);
      },
      error: (error) => {
        console.log('Error occurred while getting: ' + error);
      }
    })
  }

  public delete_product_from_order(product_id: string): void {
    this.orderService.delete_product_from_order(this.current_order._id, product_id).subscribe({
      next: () => {
        this.set_current_table(this.current_table);
      },
      error: (error) => {
        console.log('Error occurred while getting: ' + error);
      }
    })
  }

  public serve_product(product_id: string): void {
    (this.current_order.products.filter(x => x.product_id == product_id))[0].status = "complete";
    this.orderService.set_product_of_order(this.current_order._id, product_id, {status: "complete"}).subscribe({
      next: (order) => {
        //console.log(order);
      }
    })
  }

  public can_pay(): boolean {
    return (this.current_order.products.length > 0 && this.current_order.products.every(x => x.status === 'complete'));
  }

  public add_new_table(): void {
    this.tableService.post_table({num: this.add_table_data.num, seats: this.add_table_data.seats}).subscribe({
      next: (table) => {
        console.log(table);
      },
      error: (error) => {
        this.errmessage = `Table ${this.add_table_data.num} already exists`;
      }
    })
  }

  public update_seats(): void {
    this.update_table({seats: this.update_table_seats});
    window.location.reload();
  }

  public delete_table(): void {
    this.tableService.delete_table(this.current_table.num).subscribe({
      next: (table) => {
        console.log(table);
      },
      error: (error) => {
        this.errmessage = `Error while deleting the table`;
      }
    })
  }

  public generate(filename): void {
    let element = window.document.getElementById( 'receipt');
    console.log(element);
    let opt = {
      margin: 0.5,
      filename: filename + '.pdf',
      image: { type: 'jpg', quality: 0.95 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        useCORS: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    let PDF = html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.setProperties({title: 'Receipt@' + filename + '.pdf'});
    });
    PDF.save();
  }
}
