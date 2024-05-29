import { Injectable } from '@angular/core';
import {UserService} from "./user.service";
import { io } from "socket.io-client";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket : any;
  constructor(private userService : UserService) {}

  connect(): void {
    this.socket = io(this.userService.url);
  }

  get_updates(msg: string) {
    this.connect();
    return new Observable((observer) => {
      this.socket.on(msg, (data: any) => {
        console.log({msg});
        observer.next(data);
      });

      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
    });
  }
}
