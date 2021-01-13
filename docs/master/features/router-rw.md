# Router R/W

This feature automates pagination URL-changes.
The current page and limit is automatically added as query parameters when they differ from the default value.

On top of that, Router R/W will also listen for navigation-events, and change the page and limit variables on the [WatchQuery](../api-reference/watch-query.md) when they are changed in the URL. 

To enabled Router R/W, simply define the [router](../api-reference/watch-query.md#router)-parameter in [WatchQueryOptions](../api-reference/watch-query.md#options).
