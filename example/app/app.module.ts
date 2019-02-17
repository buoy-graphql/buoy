import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Apollo, ApolloModule} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LighthouseLink} from '../../ngx-buoy/src/lib/http-link/lighthouse-link';
import {LighthouseLinkOptions} from '../../ngx-buoy/src/lib/http-link/lighthouse-link-options';
import {environment} from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ApolloModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        private apollo: Apollo,
        private http: HttpClient
    ) {
        const buoy = new LighthouseLink(
            this.http,
            <LighthouseLinkOptions>{
                uri: environment.graphUri,
                httpMode: 'json',
                headers: () => {
                    console.log('GENERATING HEADERS FOR REQUEST');
                    return new HttpHeaders()
                        .set('Authorization', 'Bearer ' + localStorage.getItem('token') || null);
                },
                subscriptions: {
                    driver: 'pusher'
                }
            }
        );

        this.apollo.create({
            link: buoy,
            cache: new InMemoryCache()
        });
    }
}
