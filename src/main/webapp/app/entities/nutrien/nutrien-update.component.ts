import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { INutrien } from 'app/shared/model/nutrien.model';
import { NutrienService } from './nutrien.service';
import { IFood } from 'app/shared/model/food.model';
import { FoodService } from 'app/entities/food';

@Component({
    selector: 'jhi-nutrien-update',
    templateUrl: './nutrien-update.component.html'
})
export class NutrienUpdateComponent implements OnInit {
    nutrien: INutrien;
    isSaving: boolean;

    foods: IFood[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private nutrienService: NutrienService,
        private foodService: FoodService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ nutrien }) => {
            this.nutrien = nutrien;
        });
        this.foodService.query().subscribe(
            (res: HttpResponse<IFood[]>) => {
                this.foods = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.nutrien.id !== undefined) {
            this.subscribeToSaveResponse(this.nutrienService.update(this.nutrien));
        } else {
            this.subscribeToSaveResponse(this.nutrienService.create(this.nutrien));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<INutrien>>) {
        result.subscribe((res: HttpResponse<INutrien>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackFoodById(index: number, item: IFood) {
        return item.id;
    }
}
