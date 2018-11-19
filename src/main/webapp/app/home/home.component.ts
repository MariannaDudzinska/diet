import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';

import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs/index';
import moment = require('moment');
import { FoodService } from 'app/entities/food/food.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchResult } from 'app/account/sessions/session.model';
import { Subject } from 'rxjs/internal/Subject';
import { SessionsService } from 'app/account/sessions/sessions.service';
import { IConsumption } from 'app/shared/model/food.model';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('input')
    input: ElementRef; // To select input element

    withRefresh = false;
    foods: SearchResult[];
    foodList: Observable<SearchResult[]>;
    account: Account;
    modalRef: NgbModalRef;
    food: IConsumption;
    isSaving: boolean;
    dateOfConsumption: string;
    userextras: IUserExtra[];
    private searchField: FormControl;
    private searchText$ = new Subject<string>();
    search(packageName: string) {
        this.searchText$.next(packageName);
    }
    constructor(private principal: Principal, private loginModalService: LoginModalService,  private userExtraService: UserExtraService,
                private jhiAlertService: JhiAlertService, private eventManager: JhiEventManager, private activatedRoute: ActivatedRoute,
                private foodService: FoodService, private logsService: SessionsService) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
/*        this.activatedRoute.data.subscribe(({ food }) => {
            this.food = food;
            this.dateOfConsumption = this.food.dateOfConsumption != null ? this.food.dateOfConsumption.format(DATE_TIME_FORMAT) : null;
        });*/
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

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
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
}
