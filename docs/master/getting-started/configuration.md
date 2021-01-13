# Configuration
You must define the Buoy-configuration and add it as a provider. See [installation](installation.md#include-in-your-project) for an example.

Please note that some of these values can be overwritten by the options on a
specific [`Query`](../api-reference/query.md) or [`Mutation`](../api-reference/mutation.md).
Generally, if an option with the same name is available in
[`QueryOptions`](../api-reference/query.md#options) or
[`MutationOptions`](../api-reference/mutation.md#options), they can be overwritten locally.


## defaultLimit
Set the default limit per page for paginators.


## headers
Add headers to all HTTP-requests made by the Buoy-client to your GraphQL-endpoint.

**Example:**
```ts
import { HttpHeaders } from '@angular/common/http';
{
    headers: () => {
        return new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    },
}
```


## middleware
Add an array of middleware that can manipulate queries and mutations before and after execution.

Please refer to [Middleware](../features/middleware.md) for more information.


## paginatorType
Does your backend use `paginator` (default) or `connection` as default paginators?


## uri
The URL of the GraphQL-server. Buoy will send all requests to this address.


<!--## Extensions

### extensions
// TODO (WIP)


## Subscriptions

### subscriptions
// TODO (WIP)

-->


