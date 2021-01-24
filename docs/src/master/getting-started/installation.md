# Installation

The following section explains how to install and enable Buoy.

## Install via NPM

```bash
$ npm install @buoy/client
```

## Include in your Project
After Buoy is installed, you must include it in your application.

Add the `BuoyModule` to your `imports`-section and add the `BuoyOptions` provider in your `providers`-section.

```typescript
import { BuoyModule, BuoyOptions } from '@buoy/client';

// This part can easily be stored in a separate file
const buoyOptions = <BuoyOptions> {
    // Remember to add graphUri to your environment-file.
    uri: environment.graphUri
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BuoyModule
    ],
    providers: [
        { provide: BuoyOptions, useValue: buoyOptions }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}
```

## Executing a basic query

::: tip Up and running quickly
If you want to test Buoy without configuring it to connect with your backend, authorize, etc., feel free to use the demo-endpoint [demo.ngx-buoy.com](https://demo.ngx-buoy.com).
:::

Queries are wrapped by a [`Query`](../operations/query.md). Operations are initialized through the `Buoy` service.

**Example:**
```ts
import { Buoy } from '@buoy/client';
import { gql } from 'graphql'

@Component()
export class AppComponent {
    construct(private buoy: Buoy) {
        this.buoy.query(
            gql `
                query FavouriteMovie($movieId: Int!) {
                    movie(id: $movieId) {
                        title
                        poster
                    }
                }
            `,
            {
                movieId: 10
            },
            {
                scope: 'movie'
            }            
        ).then(
            success => console.log('Successfully executed query', success.data),
            error => console.log('Something went wrong', error.data),
        );
    }
}
```  

