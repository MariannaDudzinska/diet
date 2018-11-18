import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from './user-extra.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-user-extra-update',
    templateUrl: './user-extra-update.component.html'
})
export class UserExtraUpdateComponent implements OnInit {
    userExtra: IUserExtra;
    isSaving: boolean;

    users: IUser[];
    calsNeed: number;
    proteinNeed: number;
    fatNeed: number;
    carbsNeed: number;
    constructor(
        private jhiAlertService: JhiAlertService,
        private userExtraService: UserExtraService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userExtra }) => {
            this.userExtra = userExtra;
            const chosenLFS = this.userExtra.lifestyle === 'SITTING' ? 1.4 : this.userExtra.lifestyle === 'AVERAGE' ? 1.6 : 1.8;
            const caloriesCount = (665.09 + (1.85 * this.userExtra.height) + (9.58 * this.userExtra.weight) - (4.67 * 25));
            this.calsNeed = this.Round(((1.1 * caloriesCount) * chosenLFS), 2);
            this.proteinNeed = this.Round((this.userExtra.dietMode === 'LOSE' ? (2.2 * this.userExtra.weight) : this.userExtra.dietMode === 'BALANCED' ?
                (2.1 * this.userExtra.weight) : (2.0 * this.userExtra.weight)), 2);
            this.fatNeed = this.Round(((0.2 * caloriesCount) / 9), 2);
            this.carbsNeed = this.Round(((this.calsNeed - (this.fatNeed * 9) - (this.proteinNeed * 4)) / 4 ), 2);
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userExtra.id !== undefined) {
            this.subscribeToSaveResponse(this.userExtraService.update(this.userExtra));
            this.calsNeed = this.calsNeed;
            this.proteinNeed = this.proteinNeed;
        } else {
            this.subscribeToSaveResponse(this.userExtraService.create(this.userExtra));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUserExtra>>) {
        result.subscribe((res: HttpResponse<IUserExtra>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
    Round(n, k) {
        const factor = Math.pow(10, k);
        return Math.round(n * factor) / factor;
    }
}
