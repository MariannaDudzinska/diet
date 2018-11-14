import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IUsersWeight } from 'app/shared/model/users-weight.model';
import { Principal } from 'app/core';
import { UsersWeightService } from './users-weight.service';
import { Chart } from 'chart.js';
import { DateFormatter } from '@angular/common/src/pipes/deprecated/intl';

@Component({
    selector: 'jhi-users-weight',
    templateUrl: './users-weight.component.html'
})
export class UsersWeightComponent implements OnInit, OnDestroy {
    usersWeights: IUsersWeight[];
    logsDates: [];
    logsVals: [];
    currentAccount: any;
    eventSubscriber: Subscription;
    chart: any;

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
        this.showChart();
    }
    showChart() {
        this.usersWeightService.query().subscribe((res: HttpResponse<IUsersWeight[]>) => {
            let dates = res.body.map(res => res.dateOfLog);
            console.log(dates);
            let vals = res.body.map(res => res.valueInKg);
            console.log(vals);

            let datesArr = [];
            dates.forEach((res: any) => {
                let jsdate = new Date(res._i);
                datesArr.push(jsdate.toLocaleTimeString('en', { day: 'numeric', month: 'short' }));
            });

            console.log(datesArr);

            this.chart = new Chart('lineCharts', {
                type: 'bar',
                data: {
                    labels: datesArr.sort(),
                    datasets: [
                        {
                            label: '# kilograms',
                            data: vals,
                            backgroundColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(230, 25, 75, 1)',
                                'rgba(60, 180, 75, 1)',
                                'rgba(245, 130, 48, 1)',
                                'rgba(145, 30, 180, 1)',
                                'rgba(210, 245, 60, 1)',
                                'rgba(0, 128, 128, 1)',
                                'rgba(128, 0, 0, 1)'
                            ],
                            fill: false,
                            lineTension: 0.2,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    title: {
                        text: 'My results',
                        display: true
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        ]
                    }
                }
            });
        });
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
