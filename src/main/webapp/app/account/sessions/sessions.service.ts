import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SearchResult } from './session.model';
import { Log } from './session.model';
import { Food } from './session.model';
import { map, filter, switchMap, catchError } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class SessionsService {
    apiKey: string;
    fetchedObsFood: Observable<Food>;
    fetchedNuteiens: Observable<Food>;
    munchies = [];
    loading: Observable<Boolean>;

    constructor(private http: HttpClient) {
        this.apiKey = 'fxQVGAgTrWSsjXRsX7a0udf5ZlwGWcOCYH25z53Y';
    }

    search(query: string): Observable<SearchResult[]> {
        const url = 'https://api.nal.usda.gov/ndb/search/?format=json&';
        const params: string = [
            `q=${query}`,
            `sort=n`, // sort by relevance
            `max=25`, // maximum number of results
            `offset=0`, // beginning row in the result set to begin
            `ds=Standard%20Reference`,
            `api_key=${this.apiKey}` // Your api key
        ].join('&');

        const queryUrl = `${url}${params}`;
      /*  console.log(queryUrl);*/
        return this.http
            .get(queryUrl)
            .pipe(
                map((response: any) => {
                    if (response.list != null) {
                        console.log(response.list);
                        return response.list.item;
                    } else {
                        console.log('No data to show');
                    }
                })
            )
            .pipe(
                map((items: Array<any>) => {
                    if (items) {
                        return items.map(item => {
                            return {
                                id: item.ndbno,
                                name: item.name
                            };
                        });
                    } else {
                        console.log('No data to show2');
                    } console.log(items);
                })
            );
    }

    fetchFood(query: string): Observable<Food> {
        const url = 'https://api.nal.usda.gov/ndb/nutrients/?format=json&';
        const params: string = [
            `ndbno=${query}`,
            `nutrients=255`, // Water
            `nutrients=208`, // Energy
            `nutrients=203`, // Protein
            `nutrients=204`, // Total lipid
            `nutrients=205`, // Carbohydrate
            `nutrients=268`, // Energy
            `nutrients=269`, // Sugars
            `nutrients=291`, // Fiber
            `api_key=${this.apiKey}`
        ].join('&');

        const queryUrl = `${url}${params}`;
        console.log(queryUrl);
        this.fetchedObsFood = this.http.get(queryUrl).pipe(
            map((response: any) => {
                if (response.report != null) {
                    console.log(response.report);
                    return response.report.foods;
                } else {
                    console.log('No nutriens data to show');
                }
            })
        );
        console.log('went through');
        console.log(this.fetchedObsFood);
        return this.fetchedObsFood;
    }

    private extractData(res: any): Food {
        const body = res.report.foods[0];
        console.log('body:   ' + body);
        return new Food(body);
    }
}
