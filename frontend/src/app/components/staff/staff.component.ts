import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {StaffService} from "../../services/staff.service";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit{
  public users: User[] | any[] = [];
  public table_header = ["username", "email", "role"];
  public add_user_data = {name: "", surname: "", email:"", password: "", role: ""};
  public errmessage: any = undefined;

  constructor(private userService : UserService, private staffService : StaffService) {}

  ngOnInit(): void {
    this.get_users();
  }

  public get_users(): void {
    this.staffService.get_users().subscribe({
      next: users => {
        this.users = users;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  public add_user(): void {
    if (this.add_user_data.name.replaceAll(" ", "") === "" ||
      this.add_user_data.surname.replaceAll(" ", "") === "" ||
      this.add_user_data.email.replaceAll(" ", "") === "" ||
      this.add_user_data.password.replaceAll(" ", "") === "" ||
      this.add_user_data.role.replaceAll(" ", "") === "") {
      this.errmessage = "Invalid data";
      return;
    }

    let {name, surname, ...rest} = this.add_user_data;
    let data: any = rest;
    data["username"] = `${name} ${surname}`;
    this.staffService.post_user(data).subscribe({
      next: value => {
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  public delete_user(user: User): void {
    this.staffService.delete_user(user.email).subscribe({
      next: value => {
        window.location.reload();
      },
      error: err => {
        console.log("Error while deleting");
      }
    })
  }

}
