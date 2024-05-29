import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  private role : string = "";

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.role = this.userService.get_role();
  }

  get_role(): string {
    return this.role;
  }

  logout(): void {
    this.userService.logout();
    this.role = "";
  }

  is_authenticated(): boolean {
    return this.userService.is_authenticated();
  }

}
