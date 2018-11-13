import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UsersWeight } from 'app/shared/model/users-weight.model';
import { UsersWeightService } from './users-weight.service';
import { UsersWeightComponent } from './users-weight.component';
import { UsersWeightDetailComponent } from './users-weight-detail.component';
import { UsersWeightUpdateComponent } from './users-weight-update.component';
import { UsersWeightDeletePopupComponent } from './users-weight-delete-dialog.component';
import { IUsersWeight } from 'app/shared/model/users-weight.model';

@Injectable({ providedIn: 'root' })
export class UsersWeightResolve implements Resolve<IUsersWeight> {
    constructor(private service: UsersWeightService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UsersWeight> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<UsersWeight>) => response.ok),
                map((usersWeight: HttpResponse<UsersWeight>) => usersWeight.body)
            );
        }
        return of(new UsersWeight());
    }
}

export const usersWeightRoute: Routes = [
    {
        path: 'users-weight',
        component: UsersWeightComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'UsersWeights'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'users-weight/:id/view',
        component: UsersWeightDetailComponent,
        resolve: {
            usersWeight: UsersWeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'UsersWeights'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'users-weight/new',
        component: UsersWeightUpdateComponent,
        resolve: {
            usersWeight: UsersWeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'UsersWeights'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'users-weight/:id/edit',
        component: UsersWeightUpdateComponent,
        resolve: {
            usersWeight: UsersWeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'UsersWeights'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const usersWeightPopupRoute: Routes = [
    {
        path: 'users-weight/:id/delete',
        component: UsersWeightDeletePopupComponent,
        resolve: {
            usersWeight: UsersWeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'UsersWeights'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
