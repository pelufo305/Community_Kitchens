import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginServiceService } from '../shared/services/managers/login-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  constructor(
    public router: Router,
    private toastr: ToastrService,
    protected loginService: LoginServiceService
  ) { }

  ngOnInit() { }
  AuthUser(user) {
    this.loginService
      .AuthUser(user)
      .then(response => {
        localStorage.setItem('UserName', response.Username);
        localStorage.setItem('token', response.token);
        localStorage.setItem('TypeUser', response.UserType);
        localStorage.setItem('TypeSupplier', response.provider != null ? response.provider.Type : null);
        localStorage.setItem('isLoggedin', 'true');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(error => {
        localStorage.setItem('isLoggedin', 'false');
        this.toastr.error('Usuario con datos incorrectos');
        console.error(error);
      });
  }

  onLoggedin() {

    const user = {
      username: this.username.nativeElement.value,
      Password: this.password.nativeElement.value
    };
    this.AuthUser(user);
  }
}
