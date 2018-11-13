import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IUsersWeight } from 'app/shared/model/users-weight.model';
import { Principal } from 'app/core';
import { UsersWeightService } from './users-weight.service';

@Component({
    selector: 'jhi-users-weight',
    templateUrl: './users-weight.component.html'
})
export class UsersWeightComponent implements OnInit, OnDestroy {
    usersWeights: IUsersWeight[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private usersWeightService: UsersWeightService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.usersWeightService.query().subscribe(
            (res: HttpResponse<IUsersWeight[]>) => {
                this.usersWeights = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInUsersWeights();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IUsersWeight) {
        return item.id;
    }

    registerChangeInUsersWeights() {
        this.eventSubscriber = this.eventManager.subscribe('usersWeightListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
