import { Provider } from '@angular/core';
import { BuoyConfig } from './buoy-config';
import { BuoyConfigRepository } from './buoy-config-repository';

export function provideBuoyConfig(factory: () => BuoyConfig): Provider {
    return {
        provide: BuoyConfigRepository,
        useFactory: () => new BuoyConfigRepository(factory())
    };
}
