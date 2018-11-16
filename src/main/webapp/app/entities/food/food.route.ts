import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Food } from 'app/shared/model/food.model';
import { FoodService } from './food.service';
import { FoodComponent } from './food.component';
import { FoodDetailComponent } from './food-detail.component';
import { FoodUpdateComponent } from './food-update.component';
import { FoodDeletePopupComponent } from './food-delete-dialog.component';
import { IFood } from 'app/shared/model/food.model';

@Injectable({ providedIn: 'root' })
export class FoodResolve implements Resolve<IFood> {
    constructor(private service: FoodService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Food> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Food>) => response.ok),
                map((food: HttpResponse<Food>) => food.body)
            );
        }
        return of(new Food());
    }
}

export const foodRoute: Routes = [
    {
        path: 'food',
        component: FoodComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Foods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'food/:id/view',
        component: FoodDetailComponent,
        resolve: {
            food: FoodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Foods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'food/new',
        component: FoodUpdateComponent,
        resolve: {
            food: FoodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Foods'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'food/:id/edit',
        component: FoodUpdateComponent,
        resolve: {
            food: FoodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Foods'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const foodPopupRoute: Routes = [
    {
        path: 'food/:id/delete',
        component: FoodDeletePopupComponent,
        resolve: {
            food: FoodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Foods'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
