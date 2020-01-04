import { Component } from '@angular/core';
import * as _ from 'lodash';
import { User } from './_models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { AutoLogoutService } from './_services/autologout.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private autoLogout: AutoLogoutService
    ) {
        // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}