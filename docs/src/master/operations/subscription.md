# Subscription

The Subscription allows you to subscribe to server-side events with Buoy. A little [setup](../features/subscriptions.md) is required before use.
The Subscription returns an [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html). 

## Initializing a new Subscription

A WatchQuery is initialized through the Buoy-service.

```typescript
export class AppComponent implements OnDestroy {

    public mySubscription: Subscription;

    constructor(
        private buoy: Buoy
    ) {
        this.myMovieSubscription = this.buoy.subscribe(
            // Query
            gql `
                subscription ($id: Int!) {
                    movieUpdated(id: $id) {
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
                scope: 'movieUpdated',
                onChange: (id, data) => {
                    console.log(`Operation ${id} received a new event:`, data);
                }
            }
        );
    }
}
```

The `buoy.subscribe`-method returns an [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html).
However, it is also possible to simply add a callback with the `onChange`-option.
This method won't require you to manually unsubscribe from the Observable.

### Handling events from Buoy

TODO


## Options
Options are added as the third parameter on the `buoy.subscribe()`-method.


### scope TODO change to subscription-response
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

## Methods

### unsubscribe TODO

This method will unsubscribe you from further events from the GraphQL-server.

## Callbacks
The callbacks are also added as options on a Subscription. 


### onInitialized

Is fired once the Subscription has been initialized.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |


### onChange

Is fired when a new event is received from the server.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |
| data      | any     | Scoped data.      |
