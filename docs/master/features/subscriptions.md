# Subscriptions

The Buoy-client is compatible with the [Lighthouse-subscriptions](https://lighthouse-php.com/master/subscriptions/getting-started.html) extension.


## Getting started

After configuring your Lighthouse server to support subscriptions, you have to configure Buoy as well.

In order for Buoy to subscribe, you have to select a driver. Currently, only Pusher is supported.

### Pusher

Add following to your [BuoyConfig](../getting-started/configuration.md):

```typescript
const buoyConfig: BuoyConfig = {
    subscriptions: new PusherDriver({
        cluster: 'EU', 
        headers: {
            authorization: 'Bearer <token>'
        },
        authUrl: environment.graphUri + '/my-auth-route', // Default: graphUri + '/subscriptions/auth'
    })
};
```


## Subscribing

You can subscribe in two ways. 
Either with a manual [Subcsription](../api-reference/subscription.md) or an automatic subscription through a
[WatchQuery](../api-reference/watch-query.md#subscribe).


### Manual subscriptions

The manual subscription will fire callbacks when events are received. It will also write to the cache.
Any Query (executed after the event is received) or WatchQuery that rely on the same model,
will reflect the changes received by the event, if they allow cache data in their fetch-policy.

For more information on manual subscriptions, please refer to [Subscription](../api-reference/subscription.md).


### Subscribe through a WatchQuery <Badge text="Experimental" type="warn" />

::: tip Limitations
The automatic subscribe-option is still quite limited. It can only subscribe to a single item based on an ID.
Down the road, it should be able to subscribe to paginated views as well and handle multiple input-arguments.
::: 

In order to subscribe through a WatchQuery, the subscription must accept ID as the only parameter.

<!--If you are using GlobalIDs instead of regular integer-based IDs, you can enable Global IDs in the [BuoyConfig](../getting-started/configuration.md#globalIds).--> 

**Example:**

```typescript
const query = this.buoy.watchQuery(
    gql `
        query Post(id: Int!) {
            post(id: $id) {
                id
                title
                createdAt
            }
        }
    `,
    {
        id: 123
    },
    {
        scope: 'post',
        subscribe: 'postUpdated'
    }
);
```

Will result in following query being sent to the server:

```graphql
subscription PostUpdated(id: Int!) {
    postUpdated(id: $id) {
        id
        title
        createdAt
    }
}
```
