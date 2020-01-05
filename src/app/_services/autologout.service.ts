import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import * as store from 'store';
import { AuthenticationService } from './authentication.service';

const MINUTES_UNITL_AUTO_LOGOUT = 1440 // 1 day
const CHECK_INTERVALL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService {

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    return parseInt(store.get(STORE_KEY));
  }
  set lastAction(value) {
    store.set(STORE_KEY, value);
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVALL);
    })
  }

  reset() {
    this.lastAction = Date.now();
  }

  check() {
    const now = Date.now();
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    this.ngZone.run(() => {
      if (isTimeout) {
        console.log(`Sie wurden automatisch nach ${MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);
        this.auth.logout();
        this.router.navigate(['login']);
      }
    });
  }
}