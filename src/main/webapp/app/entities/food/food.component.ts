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
    calories: number,
    protein: number,
    fats: number,
    carbs: number,
    calsSum: number
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
    currentDate: any;
    currentDateComp: any;
    dateYMD: any;

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
                        const caloriesText = caloriesValue ? caloriesValue : 0;
                        const caloriesSum = + caloriesText;

                        const proteinNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '203');
                        const proteinValue = Number(proteinNutrient.value) * consumption.quantity;
                        const proteinText = proteinValue ? proteinValue : 0;

                        const fatsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '204');
                        const fatsValue = Number(fatsNutrient.value) * consumption.quantity;
                        const fatsText = fatsValue ? fatsValue : 0;

                        const carbsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '205');
                        const carbsValue = Number(carbsNutrient.value) * consumption.quantity;
                        const carbsText = carbsValue ? carbsValue : 0;

                        const consumptionsTableRow: ConsumptionNutrient = {
                            ...consumption,
                            calories: caloriesText,
                            protein: proteinText,
                            fats: fatsText,
                            carbs: carbsText,
                            calsSum: caloriesSum
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
        this.currentDateComp = new Date();
        this.currentDate = new Date();
        this.dateYMD = this.currentDate.toISOString().substring(0, 10);
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

    getDateNow() {
        const currentTime = new Date();
        return currentTime;
    }
    sumCals(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-me') {
                sum += (tds[i].innerHTML == null) ? 0 : Number(tds[i].innerHTML);
        }        }
        return sum;
    }
    sumProtein(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-protein') {
                sum += (tds[i].innerHTML == null) ? 0 : Number(tds[i].innerHTML);
            }        }
        return sum;
    }
    sumCarbs(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-carbs') {
                sum += (tds[i].innerHTML == null) ? 0 : Number(tds[i].innerHTML);
            }        }
        return sum;
    }
    sumFats(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-fats') {
                sum += (tds[i].innerHTML == null) ? 0 : (Number(tds[i].innerHTML));
            }
        }
        return sum;
    }

    Round(n, k) {
        const factor = Math.pow(10, k);
        return Math.round(n * factor) / factor;
    }
}
