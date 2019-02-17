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
  public me: Query;

  constructor(
      private buoy: Buoy
  ) {
      this.me = this.buoy.query(
          gql`
              query Me {
                  me {
                      firstName
                      lastName
                      email

                      profilePicture {
                          small
                          medium
                          large

                          createdAt
                          updatedAt
                          deletedAt
                      }
                  }
              }
          `,
          {

          },
          <QueryOptions>{
              subscribe: true
          }
      );
  }
}
