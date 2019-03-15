# Installation

## Install via NPM

```bash
$ npm install @buoy/client
```

## Include in your Project
After Buoy is installed, you must include it in your application.

Add the `BuoyModule` to your `imports`-section and add the `BuoyConfig` provider in your `providers`-section.

```typescript
import { BuoyModule, BuoyConfig } from '@buoy/client';

const buoyConfig = <BuoyConfig> {
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
        { provide: BuoyConfig, useValue: buoyConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}
```

## Executing a basic query

All queries are wrapped by a [`Query`](../api-reference/query.md). These are initialized through `Buoy`.

**Example:**
```ts
import { Buoy } from '@buoy/client';

@Component()
export class AppComponent {
    public favouriteMovie: Query;
    
    construct(
        private buoy: Buoy
    ) {
        this.favouriteMovie = this.buoy.query(
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
        );
    }
}
```  

The `Query` will by default automatically execute the GraphQL query immediately (can be disabled). Once the query has executed, the data is accessible on `this.favouriteMovie.data`.

```HTML
<div *ngIf="favouriteMovie.loading">
    Loading ...
</div>
<div *ngif="!favouriteMovie.loading">
    <h1>My Favourite Movie</h1>
    Title: {{ favouriteMovie.data?.title }}<br>
    Poster: <br>
    <!-- Only show the poster if there is one available -->
    <img *ngIf="favouriteMovie.data?.poster !== null"
         [src]="favouriteMovie.data.poster" /> 
</div>
```
