import { Injectable } from '@angular/core';
import { BuoyConfigRepository } from '../config/buoy-config-repository';

@Injectable()
export class DebugService {

    constructor(private config: BuoyConfigRepository) {
        if (this.config.debug) {
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
        if (!this.config.debug) {
            return;
        }

        if (payload) {
            console.log('\x1B[31m⬤', message, payload);
        } else {
            console.log('\x1B[31m⬤', message);
        }
    }
}
