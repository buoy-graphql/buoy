# Configuration
You must define the Buoy-configuration and add it as a provider. See [installation](installation.md#include-in-your-project) for an example.

::: tip
Some configuration parameters can also be modified on operation-level. However, for general stuff, it's easier to configure it globally.
:::

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

Please refer to [Middleware](../digging-deeper/middleware.md) for more information.


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


