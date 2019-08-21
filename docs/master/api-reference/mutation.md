# Mutation

The mutation is a lot like the query. However, the mutation will not cache any results locally.

## Initializing a new Mutation

Mutations are created through the `Buoy`-service. Buoy returns a Promise.
The mutation is executed immediately once initialized.

[Click here](/demo) to see a live example.

```typescript
export class AppComponent {
    constructor(
        private buoy: Buoy
    ) { }
    
    public createMovie(): void {
        this.buoy.mutate(
            // Mutation
            gql `
                mutation AddMovie($id: Int!) {
                    addMovie(tmdbId: $id) {
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
                scope: 'addMovie'
            }
        )
        .toPromise()
        .then(
            (success) => {
                // Movie was created.
                console.log('Movie was created:', success);
            },
            (error) => {
                console.log('Something went wrong:', error);
            }
        );
    }
}
```

## Options

### scope
// TODO

### optimisticResult
Not implemented

## EventListeners

### onLoadingStart
// Not implemented

### onLoadingFinished
// Not implemented
