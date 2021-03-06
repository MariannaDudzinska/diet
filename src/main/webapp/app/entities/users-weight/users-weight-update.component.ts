import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';

import { IUsersWeight } from 'app/shared/model/users-weight.model';
import { UsersWeightService } from './users-weight.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraResolve, UserExtraService } from 'app/entities/user-extra';
import { AccountService, IUser, Principal, UserService } from 'app/core';

@Component({
    selector: 'jhi-users-weight-update',
    templateUrl: './users-weight-update.component.html'
})
export class UsersWeightUpdateComponent implements OnInit {
    usersWeight: IUsersWeight;
    isSaving: boolean;

    userextras: IUserExtra[];
    users: IUser[];
    currentUser: any;
    currentDate: any;
    dateYMDhm: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private usersWeightService: UsersWeightService,
        private userExtraService: UserExtraService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private account: AccountService,
        private principal: Principal
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ usersWeight }) => {
            this.usersWeight = usersWeight;
        });
        this.userExtraService.query().subscribe(
            (res: HttpResponse<IUserExtra[]>) => {
                this.userextras = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.principal.identity().then(account => {
            this.currentUser = account;
        });
        this.currentDate = new Date();
        this.dateYMDhm = this.currentDate.toISOString().substring(0, 10);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        const loggedUserExtra = this.userextras.find(loggedUE => loggedUE.id === this.currentUser.id);
        this.usersWeight.userExtra = loggedUserExtra;
        if (this.usersWeight.id !== undefined) {
            this.subscribeToSaveResponse(this.usersWeightService.update(this.usersWeight));
        } else {
            this.subscribeToSaveResponse(this.usersWeightService.create(this.usersWeight));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUsersWeight>>) {
        result.subscribe((res: HttpResponse<IUsersWeight>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
