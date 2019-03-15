import { Buoy } from '../buoy';
import { ApolloLink, Operation, RequestHandler, Observable as LinkObservable, FetchResult } from 'apollo-link';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';
import { Context } from './lighthouse-link-options';
import { SubscriptionDriver } from '../subscription-drivers/subscription-driver';
import Pusher from '../subscription-drivers/pusher';

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
                this.buoy.http.post(this.buoy.config.uri, this.payload(operation), httpOptions)
                    .toPromise()
                    .then(
                        (result: any) => {
                            operation.setContext(result);
                            observer.next(result);
                            observer.complete();
                        },
                        (error) => {
                            // TODO Handle Http Error
                            observer.error(error); // TODO complete necessary?
                        }
                    );
            });
    }

    public request(op: Operation): LinkObservable<FetchResult> | null {
        // console.log('REQUEST!', op);
        return this.requester(op);
    }

    /**
     * Generate the HTTP Payload.
     */
    private payload(operation) {
        // Extract files from variables
        const files = extractFiles(operation.variables);

        // Define operations
        const operations = {
            operationName: operation.operationName,
            query: print(operation.query),
            variables: operation.variables,
            extensions: operation.extensions
        };

        if (files.files.size === 0) {
            return operations;
        }

        // Generate map
        const map = {};
        for (const i of Object.keys(files.files)) {
            const file = files.files[i];
            map[i] = ['variables.' + file.path];
        }

        const payload = new FormData();

        payload.append('operations', JSON.stringify(operations));
        payload.append('map', JSON.stringify(map));

        // Append files to payload
        for (const i of Object.keys(files.files)) {
            const file = files.files[i];

            payload.append(i, file.file, file.file.name);
        }

        return payload;
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
}
