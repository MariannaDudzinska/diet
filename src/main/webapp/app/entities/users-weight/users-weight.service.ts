import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUsersWeight } from 'app/shared/model/users-weight.model';

type EntityResponseType = HttpResponse<IUsersWeight>;
type EntityArrayResponseType = HttpResponse<IUsersWeight[]>;

@Injectable({ providedIn: 'root' })
export class UsersWeightService {
    public resourceUrl = SERVER_API_URL + 'api/users-weights';

    constructor(private http: HttpClient) {}

    create(usersWeight: IUsersWeight): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(usersWeight);
        return this.http
            .post<IUsersWeight>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(usersWeight: IUsersWeight): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(usersWeight);
        return this.http
            .put<IUsersWeight>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IUsersWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IUsersWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(usersWeight: IUsersWeight): IUsersWeight {
        const copy: IUsersWeight = Object.assign({}, usersWeight, {
            dateOfLog: usersWeight.dateOfLog != null && usersWeight.dateOfLog.isValid() ? usersWeight.dateOfLog.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.dateOfLog = res.body.dateOfLog != null ? moment(res.body.dateOfLog) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((usersWeight: IUsersWeight) => {
                usersWeight.dateOfLog = usersWeight.dateOfLog != null ? moment(usersWeight.dateOfLog) : null;
            });
        }
        return res;
    }
}
