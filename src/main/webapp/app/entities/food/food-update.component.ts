import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IConsumption } from 'app/shared/model/food.model';
import { FoodService } from './food.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { SearchResult } from 'app/account/sessions/session.model';
import { Subject } from 'rxjs/internal/Subject';
import { SessionsService } from '../../account/sessions/sessions.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Principal } from 'app/core';

@Component({
    selector: 'jhi-food-update',
    templateUrl: './food-update.component.html'
})
export class FoodUpdateComponent implements OnInit {
    consumption: IConsumption;
    isSaving: boolean;
    @ViewChild('input')
    input: ElementRef; // To select input element

    withRefresh = false;
    foods: SearchResult[] = [];
    foodList: Observable<SearchResult[]>;
    userextras: IUserExtra[];
    currentAccount: any;
    dateOfConsumption: string;
    isLoading = false;
    private searchField: FormControl;
    currentDate: any;
    dateYMDhm: any;

    private searchText$ = new Subject<string>();
    search(packageName: string) {
        this.searchText$.next(packageName);
    }
    constructor(
        private jhiAlertService: JhiAlertService,
        private foodService: FoodService,
        private userExtraService: UserExtraService,
        private activatedRoute: ActivatedRoute,
        private logsService: SessionsService,
        private principal: Principal
    ) {
        this.setFoods = this.setFoods.bind(this);
        this.save = this.save.bind(this);
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ food }) => {
            this.consumption = food;
            this.dateOfConsumption = this.consumption.dateOfConsumption != null ? this.consumption.dateOfConsumption.format(DATE_TIME_FORMAT) : null;
        });
        this.userExtraService.query().subscribe(
            (res: HttpResponse<IUserExtra[]>) => {
                this.userextras = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.searchField = new FormControl();
        this.foodList = this.searchField.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(searchPhrase => {
                console.log(searchPhrase);
                console.log(this.foodList);
                return this.logsService.search(searchPhrase);
            }),
            map(foodList => {
                this.setFoods(foodList);
                return foodList;
            }),
        );
        this.currentDate = new Date();
        this.dateYMDhm = this.currentDate.toISOString().substring(0, 16);
    }

    setFoods(foodList) {
        this.foods = foodList;
    }
    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.consumption.dateOfConsumption = this.dateOfConsumption != null ? moment(this.dateOfConsumption, DATE_TIME_FORMAT) : null;
        const foodObj = this.foods.find(food => food.name === this.consumption.foodName);
        this.consumption.foodNbdbo = foodObj.id;
       /* this.consumption.userExtraFood = this.currentAccount.id;*/
        if (this.consumption.id !== undefined) {
            this.subscribeToSaveResponse(this.foodService.update(this.consumption));
        } else {
            this.subscribeToSaveResponse(this.foodService.create(this.consumption));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IConsumption>>) {
        result.subscribe((res: HttpResponse<IConsumption>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserExtraById(index: number, item: IUserExtra) {
        return item.id;
    }
    assign(id) {
        console.log(id);
    }
}
