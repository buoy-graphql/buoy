import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';

@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule,
        ApolloModule,
        HttpClientModule
    ],
    providers: [
    ]
})
export class BuoyModule {
    constructor() { }
}
