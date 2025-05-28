import { CommonModule } from '@angular/common';
import { NgModule, inject, ModuleWithProviders, InjectionToken } from '@angular/core';
import { HttpClientModule, provideHttpClient, HttpClient } from '@angular/common/http';
import { DebugService } from './internal/debug.service';
import { provideNamedApollo } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { BuoyConfigRepository } from './config/buoy-config-repository';
import { HttpLink } from './link/http-link';
import { WsLink } from './link/ws-link';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        DebugService,
        provideHttpClient(),
    ]
})
export class BuoyModule {
    static forRoot(): ModuleWithProviders<BuoyModule> {
        return {
            ngModule: BuoyModule,
            providers: [
                provideNamedApollo(() => {
                    // const conf = inject(BUOY_CONFIG);
                    const config = inject(BuoyConfigRepository);
                    const http = inject(HttpClient);
                    const httpLink = new HttpLink(config, http);
                    const wsLink = new WsLink(config);

                    // Switch between links based on the operation type
                    const link = ApolloLink.from([
                        wsLink,
                        httpLink,
                    ]);

                    return {
                        buoy: {
                            link,
                            cache: new InMemoryCache(),
                        },
                    };
                }),
            ],
        };
    }
}
