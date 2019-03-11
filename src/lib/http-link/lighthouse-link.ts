import { Buoy } from '../buoy';
import { ApolloLink, Operation, RequestHandler, Observable as LinkObservable, FetchResult } from 'apollo-link';
import { mergeHeaders, prioritize } from 'apollo-angular-link-http-common';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';
import { Context } from './lighthouse-link-options';
import { SubscriptionDriver } from '../subscription-drivers/subscription-driver';
import Pusher from '../subscription-drivers/pusher';
import { BuoyConfig } from '../buoy-config';

export class LighthouseLink extends ApolloLink {
    public requester: RequestHandler;

    private subscriptionDriver: SubscriptionDriver;

    private subscriptionDrivers = {
        pusher: Pusher
    };

    constructor(private buoy: Buoy) {
        super();

        // this.initSubscriptions(options.subscriptions);

        this.requester = (operation: Operation) =>
            new LinkObservable((observer: any) => {
                const context: Context = operation.getContext();

                const includeExtensions = true; // TODO
                // const includeExtensions = pick('includeExtensions', false);
                const withCredentials = null; // pick('withCredentials');

                let httpMode = this.buoy.config.httpMode;
                let payload;

                // Count the number of files in this request
                const files = extractFiles(operation.variables);

                // Change the httpMode if mode is opportunistic and there are files in the variables
                if (httpMode === 'opportunistic') {
                   httpMode = files.length === 0 ? 'json' : 'multipart';
                }

                // Handle files
                if (httpMode === 'json') {
                    // Init the payload object
                    payload = {};

                    // TODO
                } else {
                    // Init the formData object
                    payload = new FormData();

                    for (const file of files) {
                        payload.append(file.path, file, file.name);
                    }
                }

                // Add Query
                if (httpMode === 'json') {
                    payload['query'] = print(operation.query);
                } else {
                    payload.append('query', print(operation.query));
                }


                // Add variables
                if (httpMode === 'json') {
                    payload['variables'] = operation.variables;
                } else {
                    payload.append('variables', JSON.stringify(operation.variables));
                }

                // Add extensions
                if (includeExtensions) {
                    if (httpMode === 'json') {
                        payload['extensions'] = operation.extensions;
                    } else {
                        payload.append('extensions', JSON.stringify(operation.extensions));
                    }
                }

                // Add headers
                let headers;
                if (typeof this.buoy.config.headers !== 'undefined') {
                    headers = this.buoy.config.headers();
                }

                const httpOptions = {
                    headers: headers,
                    withCredentials: withCredentials
                };

                // Send the POST request
                this.debug('debug', 'Fetching data', {context: context, httpOptions: httpOptions});
                this.buoy.http.post(this.buoy.config.endpoint, payload, httpOptions)
                    .toPromise()
                    .then(
                        (result) => {
                            operation.setContext({result});
                            observer.next(result);

                            this.debug('debug', 'Response from GraphQL', result);
                        },
                        (error) => {
                            observer.error(error);
                        }
                    );
            });
    }

    public request(op: Operation): LinkObservable<FetchResult> | null {
        // console.log('REQUEST!', op);
        return this.requester(op);
    }

    private initSubscriptions(subscriptionsConfig) {
        if (typeof subscriptionsConfig !== 'undefined') {
            let subscriptionDriverClass;

            if (typeof subscriptionsConfig.driver === 'string') {
                if (!this.subscriptionDrivers.hasOwnProperty(subscriptionsConfig.driver)) {
                    throw Error('SubscriptionDriver "' + subscriptionsConfig.driver + '" was not found.');
                } else {
                    // Get the driver class based on its name
                    subscriptionDriverClass = this.subscriptionDrivers[subscriptionsConfig.driver];
                }
            } else {
                // The driverClass is already defined
                subscriptionDriverClass = subscriptionsConfig.driver;
            }

            // Init the driver class
            this.subscriptionDriver = new subscriptionDriverClass(

            );
        }

    }

    private debug(severity: 'debug', message: string, data: any): void {
        this.buoy.debug('lighthouse-link', 'buoy', false, severity, message, data);
    }
}
