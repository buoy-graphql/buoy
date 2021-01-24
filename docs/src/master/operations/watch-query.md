# WatchQuery

The WatchQuery is a lot like a traditional Query. However, the WatchQuery is an async process that can be used to fire multiple queries.
It is great for paginated views or for data that will change over time.

On top of this, the WatchQuery has the option to subscribe to model changes from the backend.
Basic subscriptions are defined with the [`@subscribe`](#subscribe)-directive.
More advanced subscriptions are created with the [Subscription](subscription.md)-operation.

## Initializing a new WatchQuery

A WatchQuery is initialized through the Buoy-service.

```typescript
export class AppComponent {

    public myMovie: Query;

    constructor(
        private buoy: Buoy
    ) {
        this.myMovie = this.buoy.watchQuery(
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
        );
    }
}
```

The `myMovie`-variable will contain a WatchQuery-object. To access the data returned from the GraphQL-server, use the `data`-parameter (see [variables](#variables)).

### Using the data in your template

The scoped response from the GraphQL-server is available in the `data`-variable.

````HTML
<div *ngIf="!myMovie.loading">
    <h1>{{ myMovie.data?.title }}</h1>
    <img *ngIf="myMovie.data?.poster !== null"
         [src]="myMovie.data?.poster" />
</div>
<div *ngIf="myMovie.loading">
    Loading...
</div>
````

## Variables
The WatchQuery-object has following variables available:

| Parameter  | Type   | Explanation   |
| ---------- | ------ | ------------- |
| data       | any    | Contains the scoped response from the GraphQL-server. |
| pagination | any    | Pagination-details: currentPage, lastPage, perPage, etc. |
| loading    | bool   | Whether or not, the query is currently loading. |



## Methods

### nextPage
Go to the next page. Will only change page, if not on last page.

**Parameters**
| Parameter | Type    | Explanation       |
| --------- | ------- | ----------------- |
| refetch   | boolean | (Optional / default: true) Refetch the query after page changed? |
| paginator | string  | (Optional) The paginator. Only required if using multiple paginators. |


### prevPage
Go to the previous page. Will only change page, if not on first page.

**Parameters**
| Parameter | Type    | Explanation       |
| --------- | ------- | ----------------- |
| refetch   | boolean | (Optional / default: true) Refetch the query after page changed? |
| paginator | string  | Optional: The paginator. Only required if using multiple paginators. |


### setPage
Go to a specific page. Will only change page if the page is available.

**Parameters**
| Parameter | Type    | Explanation       |
| --------- | ------- | ----------------- |
| page      | number  | The desired page. |
| refetch   | boolean | (Optional / default: true) Refetch the query after page changed? |
| paginator | string  | Optional: The paginator. Only required if using multiple paginators. |


### setLimit
Go to a specific page. Will only change page if the page is available.

**Parameters**
| Parameter | Type    | Explanation       |
| --------- | ------- | ----------------- |
| limit     | number  | The desired limit. |
| refetch   | boolean | (Optional / default: true) Refetch the query after limit changed? |
| paginator | string  | Optional: The paginator. Only required if using multiple paginators. |


### refetch
Runs the query with the current options and variables. 

**Parameters**

_none_


### setVariable
Set a variable after the query has been initialized. You must use [`refetch()`](#refetch) in order to see the changes.

**Parameters**

| Parameter | Type   | Explanation   |
| --------- | ------ | ------------- |
| variable  | string | The name of the variable. |
| value     | any    | The value of the variable. |


### unsetVariable
Remove a variable from the query. You must use [`refetch()`](#refetch) in order to see the changes.

**Parameters**

| Parameter | Type   | Explanation   |
| --------- | ------ | ------------- |
| variable  | string | The name of the variable. |


## Options
Options are added as the third parameter on the `buoy.watchQuery()`-method.


### pagination
The pagination-option can be used in a few different ways.

Buoy automatically adds the necessary variables, variable values and attributes for pagination to the query.
However, you may still want to add the variables and attributes to your query in order for your code completion to work properly (depending on your IDE). 

::: tip
If you need to set the initial pagination values for page and limit, simply add them as parameters to the query.
However, once initialized, you must use the pagination methods to change page and limit. 
:::

**Basic pagination**

With basic pagination, you simply enter a scope of the paginator.

Example:
```typescript
// Options
{
    pagination: 'movies'
}
```

```graphql
query Movies ($limit: Int!, $page: Int!) {
    movies(first: $limit, page: $page) {
        data {
            id
            title
        }
    }
}
```

In this example the variables will be: `limit`, `page`.

**Multiple paginators**

With this method, an array of scopes are defined.

Example:
```typescript
// Variables
{
    actorId: 1 // This variable must be defined, since it is not related to pagination.
},
// Options
{
    pagination: [
        'movies',
        'actor.roles'
    ]
}
```

```graphql
query MyQuery (
    # This variable must be defined, since it is not related to pagination.
    $actorId: Int!,

    # It is optional to add pagination-variables
    $moviesLimit: Int!,
    $moviesPage: Int!,
    $actorRolesLimit: Int!,
    $actorRolesPage: Int!
) { 
    movies(first: $moviesLimit, page: $moviesPage) {
        data {
            id
            title
        }
    }
    actor(id: $actorId) {
        roles(first: $actorRolesLimit, page: $actorRolesPage) {
            data {
                character
            }
        }
    }
}
```

In this example the variables will be: `moviesLimit`, `moviesPage`, `actorRolesLimit` and `actorRolesPage`.

**Multiple paginators with custom paginator-type**

Use this type of pagination, if you need to query something with a paginatorType that differs from the default.

Example:
```typescript
// Variables
{
    actorId: 1 // This variable must be defined, since it is not related to pagination.
},
// Options
{
    pagination: {
        'movies': 'paginator',
        'actor.roles': 'connection'
    }
}
```

```graphql
query MyQuery (
    # This variable must be defined, since it is not related to pagination.
    $actorId: Int!,

    # It is optional to add pagination-variables
    $moviesLimit: Int!,
    $moviesPage: Int!,
    $actorRolesLimit: Int!,
    $actorRolesPage: ID! # A paginator of type "connection" use ID! for page
) { 
    movies(first: $moviesLimit, page: $moviesPage) {
        data {
            id
            title
        }
    }
    actor(id: $actorId) {
        roles(first: $actorRolesLimit, after: $actorRolesPage) {
            edges {
                character
            }
        }
    }
}
```


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

### router
This enables Router R/W, which automatically handles the necessary query params for pagination and custom variables in the query.
Enabling this, will allow the user to share a link to the page and have it load the exact same results.

Please refer to [Router R/W](../features/router-rw.md) for more information.

```ts
// Options
{
    router: {
        route: ActiveRoute,
        router: Router
    }
}
```


## Callbacks
The callbacks are also added as options on a WatchQuery. 


### onInitialized

Is fired once the WatchQuery has been initialized.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |

### onChange

Is fired when the data changes.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |
| data      | any     | Scoped data.      |
<!--
### onLimitChange

Is fired on pagination limit changes.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |
| paginator | string  | Paginator name / scope |
| limit     | number  | Max items per page |

### onPageChange

Is fired on pagination page changes.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |
| paginator | string  | Paginator name / scope |
| page      | number  | Page number       |
-->

### onLoadingStart

Is fired when `loading` is set to `true`.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |


### onLoadingFinished

Is fired when `loading` is set to `false`.

**Parameters**
| Parameter | Type    | Explanation       |
|:--------- |:------- |:----------------- |
| id        | number  | Buoy operation ID |

## Directives

### @subscribe
The subscribe-directive can be applied to the second level of queries, for example:

```graphql

query {
    # Applied to a single model
    note(id: 123) @subscribe {
        id
        name
    }
    
    # Applied to a paginated list of models
    notes(first: 25, page: 1) @subscribe {
        data {
            id
            name
        }
    }
}
```


**Defition:**
```graphql
enum EventType {
    CREATE
    UPDATE
    DELETE
}

directive @subscribe (
    "Argument to send to the subscription. Will default to 'id'."
    argument: String
    "Arguments to send to the subscription. Will default to 'id'."
    arguments: [String!]
    "Only subscribe the defined event type."
    event: EventType 
    "Only subscribe to defined event types."
    events: [EventType!]
) on FIELD_DEFINITION
```

### @skipSubscription (wip)

This directive can be used to skip individual fields based on the event type.

::: warning
This directive requires the GraphQL server to implement the [Fairway-spec](https://github.com/buoy-graphql/fairway-spec).
:::


In this example, the author is to only be included in CREATE-events:

```graphql
query {
    notes(first: 25, page: 1) @subscribe {
        data {
            id
            name
            # Only include the author in CREATE-events
            author @skipSubscription(events: [UPDATE, DELETE]) {
                id
                name
            }
            # Exclude from all subscription-events
            otherField @skipSubscription
        }
    }
}
```

**Defition:**
```graphql
enum EventType {
    CREATE
    UPDATE
    DELETE
}

directive @skipSubscription (
    "Skip the field for defined event types"
    events: [EventType!] 
) on FIELD_DEFINITION
```
