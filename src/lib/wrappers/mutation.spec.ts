import {TestBed, inject} from '@angular/core/testing';

import gql from 'graphql-tag';
import {BuoyModule} from '../buoy.module';
import {Buoy} from '../buoy';

describe('QueryPagination', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BuoyModule]
        });
    });
});
