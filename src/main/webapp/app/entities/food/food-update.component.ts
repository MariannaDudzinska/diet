import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IFood } from 'app/shared/model/food.model';
import { FoodService } from './food.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { SearchResult } from 'app/account/sessions/session.model';
import { Subject } from 'rxjs/internal/Subject';
import { SessionsService } from '../../account/sessions/sessions.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jhi-food-update',
    templateUrl: './food-update.component.html'
})
export class FoodUpdateComponent implements OnInit {
    food: IFood;
    isSaving: boolean;
    @ViewChild('input')
    input: ElementRef; // To select input element

    withRefresh = false;
    foods: SearchResult[];
    foodList: Observable<SearchResult[]>;
    userextras: IUserExtra[];
    dateOfConsumption: string;
    isLoading = false;
    private searchField: FormControl;

    private searchText$ = new Subject<string>();
    search(packageName: string) {
        this.searchText$.next(packageName);
    }
    constructor(
        private jhiAlertService: JhiAlertService,
        private foodService: FoodService,
        private userExtraService: UserExtraService,
        private activatedRoute: ActivatedRoute,
        private logsService: SessionsService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ food }) => {
            this.food = food;
            this.dateOfConsumption = this.food.dateOfConsumption != null ? this.food.dateOfConsumption.format(DATE_TIME_FORMAT) : null;
        });
        this.userExtraService.query().subscribe(
            (res: HttpResponse<IUserExtra[]>) => {
                this.userextras = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.searchField = new FormControl();
        this.foodList = this.searchField.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(packageName => {
                console.log(packageName);
                console.log(this.foodList);
                return this.logsService.search(packageName);
            })
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.food.dateOfConsumption = this.dateOfConsumption != null ? moment(this.dateOfConsumption, DATE_TIME_FORMAT) : null;
        if (this.food.id !== undefined) {
            this.subscribeToSaveResponse(this.foodService.update(this.food));
        } else {
            this.subscribeToSaveResponse(this.foodService.create(this.food));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IFood>>) {
        result.subscribe((res: HttpResponse<IFood>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
