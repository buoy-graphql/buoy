import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { DebugService } from './internal/debug.service';
import { ErrorService } from './internal/error.service';
import { OptionsService } from './internal/options.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        ApolloModule
    ],
    exports: [
        ApolloModule,
    ],
    providers: [
        OptionsService,
        DebugService,
        ErrorService,
    ]
})
export class BuoyModule {
    constructor() { }
}
