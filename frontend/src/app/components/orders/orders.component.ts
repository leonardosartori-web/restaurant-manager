import {Component, OnInit} from '@angular/core';
import {Order} from "../../models/Order";
import {OrderService} from "../../services/order.service";
import {SocketService} from "../../services/socket.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public orders: Order[] | any[] = [];
  public table_headers: string[] = ["productionTime", "table"];
  public current_order: Order = {_id: "", productionTime: new Date(), products: [], table: 0, waiter: ""};
  public products_in_queue: number = 0;

  constructor(private orderService : OrderService, private socketService : SocketService, private userService : UserService) {}

  ngOnInit(): void {
    this.get_socket_orders();
    this.get_orders();
  }

  user_role(): string {
    return this.userService.get_role();
  }

  set_current_order(order: Order): void {
    this.current_order = order;
    this.get_socket_current_order();
  }

  private get_socket_current_order(): void {
    this.socketService.get_updates('updateOrders').subscribe(() => {
      this.get_current_order();
    })
  }

  private get_socket_orders(): void {
    this.socketService.get_updates('updateOrders').subscribe(() => {
      this.get_orders();
    });
  }

  get_orders(): void {
    this.orderService.get_orders(undefined).subscribe({
        next: (orders) => {
          this.orders = orders.filter(order => {
            return order.products.some(p => p.status != 'complete' && p.status != 'ready');
          })
          let sum: number = 0;
          this.orders.forEach((order) => {
            sum += (order.products.filter((p : any) => p.status != 'complete' && p.status != 'ready')).length;
          });
          this.products_in_queue = sum;
        }
      }
    )
  }

  get_current_order(): void {
    this.orderService.get_order(this.current_order._id).subscribe({
      next: (order) => {
        this.current_order = order;
      }
    })
  }

  accept_product(product_id: string): void {
    (this.current_order.products.filter(x => x.product_id == product_id))[0].status = "processing";
    this.orderService.set_product_of_order(this.current_order._id, product_id, {status: "processing"}).subscribe({
      next: (order) => {
        //console.log(order);
      }
    })
  }

  serve_product(product_id: string): void {
    (this.current_order.products.filter(x => x.product_id == product_id))[0].status = "ready";
    this.orderService.set_product_of_order(this.current_order._id, product_id, {status: "ready"}).subscribe({
      next: (order) => {
        //console.log(order);
      }
    })
  }

}
