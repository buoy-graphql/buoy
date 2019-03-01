# Middleware

::: warning
This feature is still experimental. It is subject to change.
:::

## Introduction

Middleware allows you to manipulate queries and mutations before and after they are executed.

A use-case could be to inject variable-values into the query or to add something to the response from your backend.

## Defining middleware

Your middleware must be defined as a class that extends `Middleware`.

Out of the box, this does nothing besides allowing you to register this middleware with buoy. 

```typescript
export class InjectAgreementIdMiddleware extends Middleware {
    constructor(protected buoy: Buoy) { // You have access to Buoy in all middleware
        super();
    }
}
```

You can implement multiple interfaces, that will allow your middleware to manipulate the query, variables, HTTP-responses, etc.

### QueryManipulator

// TODO

### VariableManipulator

Will be called just before the query/ mutation is executed. Allows you to manipulate the defined variables and their values. 

## Registering middleware

### Local middleware

### Global middleware

## Accessing a service

You may need to access a service in your middleware. Since Buoy middleware are not Angular components,
they cannot access the current instances of your services. So we must inject the services into Buoy,
and access them through `this.buoy.myService`. However, in order to inject a service into Buoy, you
must overwrite the Buoy-provider with your own.  

// TODO Find a better solution.
