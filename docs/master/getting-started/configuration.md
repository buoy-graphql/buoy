# Configuration

You must define the Buoy-configuration and add it as a provider.

// TODO Example

## General
General configuration of the Buoy-client.
Please note that some of these values can be overwritten by the options on a specific `Query` or `Mutation`.

### debug
Enable debug-mode? This will output large amounts of debugging-information to the browser console.
This feature can also be enabled for a specific `Query` or `Mutation` if you only need to debug a single case.

### endpoint
The URL of the GraphQL-server. Currently, only HTTP POST-request are supported.

### fileUploads

::: tip
You must enable file uploads on your Lighthouse-server. See [this guide](../features/file-uploads.md) for more information.
:::

// TODO (WIP)

### headers
Add headers to all HTTP-requests made by the Buoy-client to your GraphQL-endpoint.

Must be an anonymous function that return a `HttpHeaders`-instance.

// TODO (WIP)

### httpMode
Determine how the Buoy-client will send requests to your GraphQL API.

### paginatorType
Does your backend use `paginator` or `connection` as default paginators?

Default: `paginator`

## Middleware

// TODO

## Extensions

### extensions
// TODO (WIP)


## Subscriptions

### subscriptions
// TODO (WIP)




