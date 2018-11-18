import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IConsumption } from 'app/shared/model/food.model';
import { Principal } from 'app/core';
import { FoodService } from './food.service';
import { Observable } from 'rxjs/internal/Observable';
import { Food, Nutrients } from 'app/account/sessions/session.model';

type ConsumptionNutrient = IConsumption & {
    calories: string,
    protein: string,
    fats: string,
    carbs: string,
};

@Component({
    selector: 'jhi-food',
    templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit, OnDestroy {
    foods: ConsumptionNutrient[];
    foodsNbdboFetched: Observable<Food[]>;
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private foodService: FoodService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.foodService.query().subscribe(
            (res: HttpResponse<IConsumption[]>) => {
                this.foods = [];
                res.body.forEach(consumption => {
                    this.foodService.fetchFood(consumption.foodNbdbo).subscribe(nutrientsArray => {
                        const caloriesNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '208');
                        const caloriesValue = Number(caloriesNutrient.value) * consumption.quantity;
                        const caloriesText = caloriesValue.toString() + caloriesNutrient.unit;

                        const proteinNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '203');
                        const proteinValue = Number(proteinNutrient.value) * consumption.quantity;
                        const proteinText = proteinValue.toString() + proteinNutrient.unit;

                        const fatsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '204');
                        const fatsValue = Number(fatsNutrient.value) * consumption.quantity;
                        const fatsText = fatsValue.toString() + fatsNutrient.unit;

                        const carbsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '205');
                        const carbsValue = Number(carbsNutrient.value) * consumption.quantity;
                        const carbsText = carbsValue.toString() + carbsNutrient.unit;

                        const consumptionsTableRow: ConsumptionNutrient = {
                            ...consumption,
                            calories: caloriesText,
                            protein: proteinText,
                            fats: fatsText,
                            carbs: carbsText,
                        };
                        this.foods.push(consumptionsTableRow);
                    });
                });
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInFoods();

        /* this.foodsNbdboFetched = this.foodService.fetchedNuteiens(foods.foodNbdbo);*/
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IConsumption) {
        return item.id;
    }

    registerChangeInFoods() {
        this.eventSubscriber = this.eventManager.subscribe('foodListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
