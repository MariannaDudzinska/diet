import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { INutrien } from 'app/shared/model/nutrien.model';

type EntityResponseType = HttpResponse<INutrien>;
type EntityArrayResponseType = HttpResponse<INutrien[]>;

@Injectable({ providedIn: 'root' })
export class NutrienService {
    public resourceUrl = SERVER_API_URL + 'api/nutriens';

    constructor(private http: HttpClient) {}

    create(nutrien: INutrien): Observable<EntityResponseType> {
        return this.http.post<INutrien>(this.resourceUrl, nutrien, { observe: 'response' });
    }

    update(nutrien: INutrien): Observable<EntityResponseType> {
        return this.http.put<INutrien>(this.resourceUrl, nutrien, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<INutrien>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<INutrien[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
