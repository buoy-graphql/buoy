import { Injectable, Optional } from '@angular/core';
import { BuoyOptions } from '../buoy-options';

@Injectable()
export class OptionsService {
    readonly values: BuoyOptions;

    constructor(
        @Optional() private options: BuoyOptions,
    ) {
        // Load default config and overwrite with the users configuration.
        this.values = Object.assign(new BuoyOptions(), options);
    }
}
