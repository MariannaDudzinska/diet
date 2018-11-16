import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Nutrien } from 'app/shared/model/nutrien.model';
import { NutrienService } from './nutrien.service';
import { NutrienComponent } from './nutrien.component';
import { NutrienDetailComponent } from './nutrien-detail.component';
import { NutrienUpdateComponent } from './nutrien-update.component';
import { NutrienDeletePopupComponent } from './nutrien-delete-dialog.component';
import { INutrien } from 'app/shared/model/nutrien.model';

@Injectable({ providedIn: 'root' })
export class NutrienResolve implements Resolve<INutrien> {
    constructor(private service: NutrienService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Nutrien> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Nutrien>) => response.ok),
                map((nutrien: HttpResponse<Nutrien>) => nutrien.body)
            );
        }
        return of(new Nutrien());
    }
}

export const nutrienRoute: Routes = [
    {
        path: 'nutrien',
        component: NutrienComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Nutriens'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'nutrien/:id/view',
        component: NutrienDetailComponent,
        resolve: {
            nutrien: NutrienResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Nutriens'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'nutrien/new',
        component: NutrienUpdateComponent,
        resolve: {
            nutrien: NutrienResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Nutriens'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'nutrien/:id/edit',
        component: NutrienUpdateComponent,
        resolve: {
            nutrien: NutrienResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Nutriens'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const nutrienPopupRoute: Routes = [
    {
        path: 'nutrien/:id/delete',
        component: NutrienDeletePopupComponent,
        resolve: {
            nutrien: NutrienResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Nutriens'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
