import { Injectable } from '@angular/core';
import { OptionsService } from '../internal/options.service';

@Injectable()
export class DebugService {

    constructor(private options: OptionsService) {
        if (this.options.values.debug === true) {
            this.print('Buoy debugging is enabled globally.');
        }
    }

    public subscriptionEvent(operation, payload): void {
        this.print(
            'Received new Subscription event:\n',
            payload
        );
    }

    private print(message: string, payload: any = null): void {
        if (!this.options.values.debug) {
            return;
        }

        if (payload) {
            console.log('\x1B[31m⬤', message, payload);
        } else {
            console.log('\x1B[31m⬤', message);
        }
    }
}
