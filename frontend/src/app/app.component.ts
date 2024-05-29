import {Component, OnInit} from '@angular/core';
import {SocketService} from "./services/socket.service";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Restaurant';
  message : string | undefined = "";
  alert_type = "";

  constructor(private socketService : SocketService, private userService : UserService) {}

  ngOnInit(): void {
    this.get_socket_notification();
  }

  private get_socket_notification(): void {
    this.socketService.get_updates(this.userService.get_id()).subscribe((msg:any) => {
      this.activateAlert(msg);
    })
  }

  private activateAlert(msg: string): void {
    this.alert_type = 'success';
    this.message = msg;

    setTimeout(() => {
      this.message = undefined;
    }, 10000);
  }
}
