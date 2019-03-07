# Query

The Query-object is a wrapper around the Apollo-client. The wrapper keeps track of pagination and makes it easier to change variables after the query has been executed.

## Initializing a new Query

All new queries and mutations are created through the `Buoy`-service. 

[Click here](/demo) to see a live example.

```typescript
export class AppComponent {

    public myMovie: Query;

    constructor(
        private buoy: Buoy
    ) {
        this.myMovie = this.buoy.query(
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

The `myMovie`-variable will contain a Query-object. To access the data returned from the GraphQL-server, use the `data`-parameter (see [variables](#variables)).

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

### Waiting for response in your code
::: warning
This feature is experimental. It is subject to change.
:::

The data parameter will not contain anything before the query has been executed.
In order to make an async functional, that waits for a response, you must use a listener.

```typescript
export class AppComponent {

    public myMovie: Query;
    provate myMovieSubscription: Subscription;
    
    constructor(
            private buoy: Buoy
        ) {
            this.myMovie = this.buoy.query();
            this.myMovieSubscription = this.myMovie.onChanges.subscribe((query: Query) => {
                console.log('Query response:', query.data);
            });
        }
    
}
```

## Variables
The Query-object has following variables available:

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
Options are added as the third parameter on the `buoy.query()`-method.

### debug
This will print all relevant debug-information to the console. Should not be used in production.

### pagination
The pagination-option can be used in a few different ways.

Buoy automatically adds the necessary variables, variable values and attributes for pagination to the query.
However, you may still want to add the variables and attributes to your query in order for your code completion to work properly (depending on your IDE). 

::: tip
If you need to set the initial pagination values for page and limit, simply add them as parameters to the query.
However, once initialized, you must use the pagination methods to change page and limit. 
:::

**Simple pagination**

With simple pagination, you simply enter a scope of the paginator.

Example:
```typescript
// Options
{
    pagination: 'movies'
}
```

```graphql
query Movies ($limit: Int!, $page: Int!) { # Optional to add variables
    movies(count: $limit, page: $page) { # Optional to add attributes
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
    movies(count: $moviesLimit, page: $moviesPage) { # Optional to add attributes
        data {
            id
            title
        }
    }
    actor(id: $actorId) {
        roles(count: $actorRolesLimit, page: $actorRolesPage) {
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
    movies(count: $moviesLimit, page: $moviesPage) { # Optional to add attributes
        data {
            id
            title
        }
    }
    actor(id: $actorId) {
        roles(first: $actorRolesLimit, after: $actorRolesPage) { # Optional to add attributes
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

```JSON
{
    "movies": {
        "data": []
    }
}
```

With the scope `movies.data`, you can skip the two first levels. This allows you to refer to the returned data as `movies.data...` instead of so `movies.data.movies.data...`. 

The scope should generally be the name of the first node in your query followed by `.data`, if your node is a paginator.

### subscribe
TODO

## EventListeners
The EventListeners are also added as options on a query.
All EventListeners must be defined as a callback.

### onPageChange
// TODO

### onLoadingStart
// TODO

### onLoadingFinished
// TODO

### 
