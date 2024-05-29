import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public login_data = {"email": "", "password": ""};
  public errmessage: any = undefined;

  constructor(private router: Router, private us: UserService) {}

  ngOnInit(): void {
    if (this.us.is_authenticated()) this.router.navigate([this.us.dashboard_routes[this.us.get_role()]]);
  }

  login(): void {
    this.us.login(this.login_data.email, this.login_data.password).subscribe({
      next: (d) => {
        console.log("Login granted: " + JSON.stringify(d));
        console.log("User service token: " + this.us.get_token());
        this.errmessage = undefined;
        console.log(this.us.get_role());
        window.location.reload();
      },
      error: (err) => {
        this.errmessage = "Username or Password are wrong, please try again.";
      }
    })
  }
}
