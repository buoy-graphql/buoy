---
id: query
title: Query
sidebar_label: Query
---

The Query-object is a wrapper around the Apollo-client. The wrapper keeps track of pagination and makes it easier to change variables after the query has been executed.

## Initialising a new Query

All new queries and mutations are created through the [`Buoy`](buoy)-service. 

[Click here](/demo) to see a live example.

```typescript
export class AppComponent {

    public myMovie;

    constructor(
        private buoy: Buoy
    ) {
        this.myMovie = this.buoy.query(
            gql `
                query Movie($id: Int!) {
                    movie(id: $id) {
                        id
                        title
                        poster
                    }
                }
            `,
            {
                id: 1
            },
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

## Variables
The `myMovie`-variable will contain a Query-object. This object has following variables available:

| Parameter  | Type   | Explanation   |
| ---------- | ------ | ------------- |
| data       | any    | Contains the scoped response from the GraphQL-server. |
| pagination | any    | The value of the variable. |
| loading    | bool   | Whether or not, the query is currently loading. |



## Methods

### refetch
Runs the query with the current configuration, variables, pagination, etc. 

**Parameters**

_none_

### setVariable
Set a variable after the query has been initialized. You must use [`refetch()`](#refetch) in order to see the changes.

**Parameters**

| Parameter | Type   | Explanation   |
| --------- | ------ | ------------- |
| variable  | string | The name of the variable. |
| value     | any    | The value of the variable. |


## Configuration
