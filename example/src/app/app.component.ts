import { Component } from '@angular/core';
import gql from 'graphql-tag';
import { Buoy } from '../../../src/lib/buoy';
import { Query } from '../../../src/lib/wrappers/query';
import { QueryOptions } from '../../../src/lib/wrappers/options';

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
              query Movies($moviesPage: Int!) {
                  movies(count: $moviesLimit, page: $moviesPage) {
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
                      paginatorInfo {
                          lastPage
                          total
                      }
                  }

                  actor(id: 1) {
                      roles(count: $actorRolesLimit, page: $actorRolesPage) {
                          data {
                              character
                          }
                      }
                  }
              }
          `,
          {
          //    moviesPage: 1,
          //    moviesLimit: 2,
          //    test: 'qweqwe'
          },
          <QueryOptions>{
              subscribe: true,
              scope: 'movies',
              pagination: [
                  'movies',
                  'actor.roles'
              ]
          }
      );
  }
}
