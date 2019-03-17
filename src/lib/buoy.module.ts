import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        ApolloModule,
        HttpClientModule
    ],
    providers: [
    ]
})
export class BuoyModule {
    constructor() { }
}
