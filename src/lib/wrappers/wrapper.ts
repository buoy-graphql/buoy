import {Buoy} from '../buoy';

export class Wrapper {
    constructor(public _buoy: Buoy, protected _id: number, protected _type) {

    }

    protected debug(severity: 'debug', message: string, data?: any): void {
        this._buoy.debug(this._id, this._type, false, severity, message, data);
    }

    /**
     * Destroy the Query / Mutation
     */
    public destroy () {
        // Will be overwritten by Query / Mutation.
    }
}
