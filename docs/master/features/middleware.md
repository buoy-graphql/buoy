# Middleware

Middleware allows you to manipulate queries and mutations before and after they are executed.

A use-case could be to inject variable-values into the query or to add something to the response from your backend.

## Defining middleware

Your middleware should be defined as a class that implements one of the interfaces below.

You can implement multiple interfaces, that will allow your middleware to manipulate queries, variables, HTTP-responses, etc.

### HeaderManipulator

Manipulate headers on HTTP-requests before they are sent off.

**Example:**
```typescript
export class MyMiddleware implements HeaderManipulator {
    manipulateHeaders(headers: HttpHeaders, query: Document, variables: any): HttpHeaders {
        if (something) {
            return headers.append('my-header', 'my-value');
        }
        return headers;
    }
}
```

### QueryManipulator

Manipulate queries and mutations before they are executed.

**Example:**
```typescript
export class MyMiddleware implements QueryManipulator {
    manipulateQuery(query: Document, variables: any, options: QueryOptions | WatchQueryOptions | MutationOptions): Document {
        return query;
    }
}
```

### ResponseManipulator

Will be called when the HTTP-link receives a response from the GraphQL-server.

**Example:**
```typescript
export class MyMiddleware implements ResponseManipulator {
    manipulateResponse(response: any, query: Document, variables: any): any {
        return response;
    }
}
```

### VariableManipulator

Will be called just before the query/ mutation is executed. Allows you to manipulate the defined variables and their values.

**Example:**
```typescript
export class MyMiddleware implements VariableManipulator {
    manipulateVariables(query: Document, variables: any, options: QueryOptions | WatchQueryOptions | MutationOptions): any {
        return variables;
    }
}
```

## Registering middleware

### Local middleware

Currently not supported

### Global middleware

Simply add an array of middleware to the [`middleware`](../getting-started/configuration.md#middleware)-parameter in BuoyConfig.

### Global middleware with dependencies

Sometimes you may need to access a service inside your middleware.
In order to give access to your custom services, you must inject them into the middleware when registering it.

**Example:**

```typescript
export class AppModule {
    constructor(
        private buoy: Buoy,
        private myService: MyService
    ) {

        // Register Buoy middleware
        this.buoy.registerMiddleware(
            MyMiddleware,
            [this.myService] // Parameters
        );
    }
}
```

Buoy will automatically add all parameters defined when registering, to the middleware when it is initialized.

**Example:**

```typescript
export class MyMiddleware {
    constructor(private myService: MyService) { }
}
```
