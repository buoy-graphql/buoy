import { Component } from '@angular/core';
import gql from 'graphql-tag';
import {Buoy} from '../../ngx-buoy/src/lib/buoy';
import {Query} from '../../ngx-buoy/src/lib/wrappers/query';
import {QueryOptions} from '../../ngx-buoy/src/lib/wrappers/options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public movies: Query;

  constructor(
      private buoy: Buoy
  ) {
      this.movies = this.buoy.query(
          gql`
              query Movies {
                  movies(count: 5, page: 1) {
                      data {
                          id
                          title
                          status
                          release_date

                          roles(count: 3) {
                              data {
                                  character
                                  actor {
                                      name
                                      profile
                                  }
                              }
                              paginatorInfo {
                                  total
                              }
                          }
                      }
                  }
              }
          `,
          {

          },
          <QueryOptions>{
              subscribe: true,
              scope: 'movies'
          }
      );
  }
}
