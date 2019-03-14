import { Buoy } from '../buoy';

export interface Wrapper {

    /**
     * Contains the Buoy service.
     */
    _buoy: Buoy;

    /**
     * Unique id for current query or mutation.
     */
    _id: number;
}
