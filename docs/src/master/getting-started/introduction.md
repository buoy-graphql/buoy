# Introduction

::: warning Under development
Please note that Buoy is still in development. 
:::

Buoy is a GraphQL client built on top of [Apollo Client](https://www.apollographql.com/docs/react/) and [Apollo Angular](https://apollo-angular.com/).

On top of what Apollo already provides, Buoy will handle [pagination](../operations/watch-query.md#pagination) and url changes,
automatic basic subscriptions with the [@subscribe](../operations/watch-query.md#directives) directive
[file uploads](../digging-deeper/file-uploads.md), [middleware](../digging-deeper/middleware.md) and more.

These docs will help to learn how the Buoy is used.

All examples in the documentation is based on a [Laravel Lighthouse](https://lighthouse-php.com) GraphQL server. Other servers may require a different setup.

If your server and schema conforms to the [Fairway spec](https://github.com/buoy-graphql/fairway-spec) you should be good. However, subscriptions may require a [custom subscriptions driver](../customization/subscription-driver.md). 


## Assumptions
These docs assume that you are already familiar with the basics of GraphQL and the Angular framework. 

## Feedback
Any feedback is greatly appreciated. If you have suggestions or additions to the docs or Buoy itself, feel free to create an issue or a pull request on [Github](https://github.com/haffdata/buoy).

If you like the library, don't forgot to give it a [Star on GitHub](https://github.com/buoy-graphql/buoy/stargazers).
