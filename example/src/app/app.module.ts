import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {BuoyConfig} from '../../../ngx-buoy/src/lib/buoy-config';
import {BuoyModule} from '../../../ngx-buoy/src/lib/buoy.module';

const BuoyConfigValue = <BuoyConfig>{
    endpoint: environment.graphUri
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BuoyModule
    ],
    providers: [
        { provide: BuoyConfig, useValue: BuoyConfigValue }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}
