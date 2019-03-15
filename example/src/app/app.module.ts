import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { BuoyConfig } from '../../../src/lib/buoy-config';
import { BuoyModule } from '../../../src/lib/buoy.module';

const BuoyConfigValue = <BuoyConfig>{
    uri: environment.graphUri
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
