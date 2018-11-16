import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { INutrien } from 'app/shared/model/nutrien.model';
import { Principal } from 'app/core';
import { NutrienService } from './nutrien.service';

@Component({
    selector: 'jhi-nutrien',
    templateUrl: './nutrien.component.html'
})
export class NutrienComponent implements OnInit, OnDestroy {
    nutriens: INutrien[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private nutrienService: NutrienService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.nutrienService.query().subscribe(
            (res: HttpResponse<INutrien[]>) => {
                this.nutriens = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInNutriens();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: INutrien) {
        return item.id;
    }

    registerChangeInNutriens() {
        this.eventSubscriber = this.eventManager.subscribe('nutrienListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
