import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNGConfig,
        private cookieService: CookieService
    ) {
        //cookieService.deleteAll();
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
