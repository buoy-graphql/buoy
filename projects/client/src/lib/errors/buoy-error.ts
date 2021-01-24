import { Docs } from '../docs';

export class BuoyError extends Error {

    constructor(message: string, docs?: string) {
        let fullMessage = message;

        if (docs) {
            docs = docs.replace(/^\/+/g, '');
            fullMessage += ` ( See: https://ngx-buoy.com/${Docs.docsVersion}/${docs} )`;
        }

        super(fullMessage);
        this.name = 'BuoyError';
    }
}
