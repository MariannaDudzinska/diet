import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IConsumption } from 'app/shared/model/food.model';
import { Principal } from 'app/core';
import { FoodService } from './food.service';
import { UserExtraService } from '../user-extra/user-extra.service';
import { Observable } from 'rxjs/internal/Observable';
import { Food, Nutrients } from 'app/account/sessions/session.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

type ConsumptionNutrient = IConsumption & {
    calories: number,
    protein: number,
    fats: number,
    carbs: number
};

@Component({
    selector: 'jhi-food',
    templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit, OnDestroy {
    foods: ConsumptionNutrient[];
    foodsNbdboFetched: Observable<Food[]>;
    currentAccount: any;
    account: any;
    eventSubscriber: Subscription;
    currentDate: any;
    currentDateComp: any;
    dateYMD: any;
    userExtra: IUserExtra;
    calsNeed: number;
    proteinNeed: number;
    fatNeed: number;
    carbsNeed: number;
    calsUsed: number;
    proteinUsed: number;
    fatsUsed: number;
    carbsUsed: number;
    constructor(
        private foodService: FoodService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private userExtraService: UserExtraService
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
                            carbs: carbsText
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
            this.getCurrentUserExtra(this.currentAccount.id);
        });
        this.registerChangeInFoods();
        this.currentDateComp = new Date();
        this.currentDate = new Date();
        this.dateYMD = this.currentDate.toISOString().substring(0, 10);
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

    getCurrentUserExtra(userextraid) {
        console.log(userextraid);
        this.userExtraService.find(userextraid).subscribe(
            (res: HttpResponse<IUserExtra>) => {
                this.userExtra = res.body;
                const chosenLFS = this.userExtra.lifestyle === 'SITTING' ? 1.4 : this.userExtra.lifestyle === 'AVERAGE' ? 1.6 : 1.8;
                const caloriesCount = (665.09 + (1.85 * this.userExtra.height) + (9.58 * this.userExtra.weight) - (4.67 * 25));
                this.calsNeed = (1.1 * caloriesCount) * chosenLFS;
                this.proteinNeed = this.userExtra.dietMode === 'LOSE' ? (2.2 * this.userExtra.weight) : this.userExtra.dietMode === 'BALANCED' ?
                    (2.1 * this.userExtra.weight) : (2.0 * this.userExtra.weight);
                this.fatNeed = (0.2 * caloriesCount) / 9;
                this.carbsNeed = (this.calsNeed - (this.fatNeed * 9) - (this.proteinNeed * 4)) / 4 ;
                this.calsUsed = this.sumCals();
                this.fatsUsed = this.sumFats();
                this.carbsUsed = this.sumCarbs();
                this.proteinUsed = this.sumCals();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
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
            }
        }
        return this.Round(sum, 2);
    }

    sumProtein(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-protein') {
                sum += (tds[i].innerHTML == null) ? 0 : Number(tds[i].innerHTML);
            }
        }
        return this.Round(sum, 2);
    }

    sumCarbs(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-carbs') {
                sum += (tds[i].innerHTML == null) ? 0 : Number(tds[i].innerHTML);
            }
        }
        return this.Round(sum, 2);
    }

    sumFats(): number {

        const tds = document.getElementById('nutrientVals').getElementsByTagName('td');
        let sum = 0;
        for (let i = 0; i < tds.length; i++) {
            if (tds[i].className === 'count-fats') {
                sum += (tds[i].innerHTML == null) ? 0 : (Number(tds[i].innerHTML));
            }
        }
        return this.Round(sum, 2);
    }

    Round(n, k) {
        const factor = Math.pow(10, k);
        return Math.round(n * factor) / factor;
    }

    countNeeds() {
        const chosenLFS = this.userExtra.lifestyle === 'SITTING' ? 1.4 : this.userExtra.lifestyle === 'AVERAGE' ? 1.6 : 1.8;
        const caloriesCount = 665.09 + (1.85 * this.userExtra.height) + (9.58 * this.userExtra.weight) - (4.67 * 25);
        this.calsNeed = (1.1 * caloriesCount) * chosenLFS;
        this.proteinNeed = this.userExtra.dietMode === 'LOSE' ? (2.2 * this.userExtra.weight) : this.userExtra.dietMode === 'BALANCED' ?
            (2.1 * this.userExtra.weight) : (2.0 * this.userExtra.weight);
        this.fatNeed = (0.2 * caloriesCount) / 9;
        this.carbsNeed = this.calsNeed - (this.fatNeed * 9) - (this.proteinNeed * 4);
    }
}
