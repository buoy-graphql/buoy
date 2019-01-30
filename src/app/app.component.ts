import { Component } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public _query;

  public data;

  constructor(private apollo: Apollo) {
      this._query = this.apollo.watchQuery({
          query: gql`
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
          variables: {}
      })
      .valueChanges.subscribe(result => {
          console.log('FETCHED DATA FROM GRAPH', result);
          this.data = result.data;
      });
  }
}
