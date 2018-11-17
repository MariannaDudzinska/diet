import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IConsumption} from 'app/shared/model/food.model';

type EntityResponseType = HttpResponse<IConsumption>;
type EntityArrayResponseType = HttpResponse<IConsumption[]>;

@Injectable({ providedIn: 'root' })
export class FoodService {
    public resourceUrl = SERVER_API_URL + 'api/foods';

    constructor(private http: HttpClient) {}

    create(food: IConsumption): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(food);
        return this.http
            .post<IConsumption>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(food: IConsumption): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(food);
        return this.http
            .put<IConsumption>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IConsumption>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IConsumption[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(food: IConsumption): IConsumption {
        const copy: IConsumption = Object.assign({}, food, {
            dateOfConsumption: food.dateOfConsumption != null && food.dateOfConsumption.isValid() ? food.dateOfConsumption.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.dateOfConsumption = res.body.dateOfConsumption != null ? moment(res.body.dateOfConsumption) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((food: IConsumption) => {
                food.dateOfConsumption = food.dateOfConsumption != null ? moment(food.dateOfConsumption) : null;
            });
        }
        return res;
    }
}
