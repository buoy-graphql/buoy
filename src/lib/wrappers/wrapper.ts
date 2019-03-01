import {Buoy} from '../buoy';

export class Wrapper {
    constructor(protected buoy: Buoy, protected _id: number, protected _type) {

    }

    protected debug(severity: 'debug', message: string, data?: any): void {
        this.buoy.debug(this._id, this._type, false, severity, message, data);
    }
}
