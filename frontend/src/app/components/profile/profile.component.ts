import {Component, OnInit} from '@angular/core';
import {StaffService} from "../../services/staff.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  public new_password = "";
  public errmessage: any = undefined;
  public user: User = {email: "", id: "", role: "", username: ""};

  constructor(private userService : UserService, private staffService : StaffService) {
    this.user = this.userService.get_user();
  }

  public update_password(): void {
    if (this.new_password.replaceAll(" ", "") === "") {
      this.errmessage = "Invalid data";
      return;
    }
    this.staffService.update_user(this.userService.get_email(), {password: this.new_password}).subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.log("Error while updating");
      }
    })
  }

}
