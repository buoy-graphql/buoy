# Query

The Query executes a GraphQL query once and returns the result as a Promise.
It is great for one-time queries where the. For data to be used in your template the [WatchQuery](watch-query) is better suited.

## Execute a query

Queries are executed from the `Buoy`-service. 

[Click here](/demo) to see a live example.

```typescript
export class AppComponent {
    constructor(
        private buoy: Buoy
    ) {
        this.buoy.query(
            // Query
            gql `
                query Movie($id: Int!) {
                    movie(id: $id) {
                        title
                        poster
                    }
                }
            `,
            // Variables
            {
                id: 1
            },
            // Options
            {
                scope: 'movie'
            }
        ).then(
            (success: QueryResult) => {
                console.log('Fetched movie', success.data);
            },
            (error: QueryError) => {
                // Handle error
            }
        );
    }
}
```

The returned promise will either return a QueryError or a QueryResult. If successful, ``success.data` will contained the scoped response from the GraphQL server.

### Using the data in your template

The scoped response from the GraphQL-server is available in the `data`-variable.

```HTML
<div *ngIf="!myMovie.loading">
    <h1>{{ myMovie.data?.title }}</h1>
    <img *ngIf="myMovie.data?.poster !== null"
         [src]="myMovie.data?.poster" />
</div>
<div *ngIf="myMovie.loading">
    Loading...
</div>
```

## Options
Options are added as the third parameter on the `buoy.query()`-method.

### scope
The scope will change the root of the data returned by the GraphQL-server.

The server will often return something like this:

```json
{
    "movies": {
        "data": [
            { "title": "Movie 1" },
            { "title": "Movie 2" }
        ]
    }
}
```

With the scope `movies.data`, you can skip the two first levels, and receive:

```json
[
    { "title": "Movie 1" },
    { "title": "Movie 2" }
]
``` 

The scope should generally be the name of the first node in your query followed by `.data`, if your node is a paginator.
