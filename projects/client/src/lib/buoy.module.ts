import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ApolloModule
    ],
    exports: [
        ApolloModule,
    ]
})
export class BuoyModule {
    constructor() { }
}
