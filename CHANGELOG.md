# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

You can find and compare releases at the [NPM releases page](https://www.npmjs.com/package/@buoy/client?activeTab=versions).

## [0.15.0] - 2023-06-13

### Added
- Add generic type to Paginator operation.

## [0.14.1] - 2023-04-25

### Fixed
- Never reject the promise returned from the refetch method of the WatchQuery.

## [0.14.0] - 2023-04-25

### Added
- Return promises from the refetch method of the WatchQuery.

## [0.13.0] - 2023-03-24

### Added
- Add generic type to the operations.

## [0.11.1] - 2023-02-15

### Fixed
- Only throw GraphQLError when the error has category "graphql".

## [0.11.0] - 2023-01-04

### Added
- Added custom errors: GraphQLError and NetworkError.

## [0.10.1] - 2022-12-16

### Fixed
- Fixed edge-case causing exception being thrown in destroy().

## [0.10.0] - 2022-12-14

### Added
- Added options for setting the default fetchPolicy.

## [0.9.0] - 2022-10-26

### Added
- Added new clearCache method to the Buoy-service.

## [0.8.0] - 2022-07-26

### Added
- Added new Paginator operation

## [0.7.2] - 2022-06-15

### Fixed
- Fix bug that would cause a paginated WatchQuery to crash upon getting destroyed.

## [0.7.1] - 2022-06-10

### Fixed
- Released correct build on NPM.

## [0.7.0] - 2022-06-10

### Changed
- Added support for creating new subscriptions when the parent WatchQuery is refeteched.

## [0.6.2] - 2022-04-16

### Changed
- Added support for Angular 13.

## [0.6.1] - 2021-10-26

### Changed
- Added support for Angular 12.

## [0.6.0] - 2021-10-26

### Changed
- Fix pagination in WatchQuery.

## [0.5.2] - 2020-02-24

### Added
- Add observable values to the WatchQuery (observe.ready and observe.data).

## [0.5.1] - 2020-02-16

### Changed
- Fix fetch policy being ignored in queries.

## [0.5.0] - 2020-02-03

This is the beginning of the changelog.
