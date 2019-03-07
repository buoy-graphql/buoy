import {TestBed, inject} from '@angular/core/testing';

import {Buoy} from './buoy';
import {BuoyModule} from './buoy.module';
import gql from 'graphql-tag';
import {BuoyConfig} from './buoy-config';
import {HttpHeaders} from '@angular/common/http';

const buoyConfig: BuoyConfig = {
    middleware: [],
    httpMode: 'opportunistic',
    paginatorType: 'paginator',
    headers: () => {
        return new HttpHeaders().set('CLIENT', 'test');
    },
    endpoint: '',
};

describe('Buoy', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BuoyModule],
            providers: [
                { provide: BuoyConfig, useValue: buoyConfig}
            ]
        });
    });

    it('should be created', inject([Buoy], (buoy: Buoy) => {
        expect(buoy).toBeTruthy();
    }));

    it('should init a Query', inject([Buoy], (buoy: Buoy) => {
        const query = buoy.query(
            gql `
                query {
                    movie(id: $id) {
                        name
                    }
                }
            `,
            {
                id: 123
            },
            {
                scope: 'movies',
                pagination: 'movies'
            }
        );

        console.log(query);

        expect(typeof query === 'object').toBeTruthy();
    }));

    it('should load BuoyConfiguration', inject([Buoy], (buoy: Buoy) => {
        expect(buoy.config).toEqual(jasmine.objectContaining(buoyConfig));
    }));

    // TODO Test config
});
