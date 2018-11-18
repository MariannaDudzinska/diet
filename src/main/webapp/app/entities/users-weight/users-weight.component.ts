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
            const condition = res.body.map(res => res.userExtra.id);
            const currId = this.currentAccount.id;
            // ----------------------------------------------
            const dates = res.body.map(res => {
                if (res.userExtra.id === currId) {
                    return res.dateOfLog;
                } else {
                    return null;
                }
            });
            // console.log(dates);
            const vals = res.body.map(res => {
                if (res.userExtra.id === currId) {
                    return res.valueInKg;
                } else {
                    return null;
                }
            });
            // console.log(vals);

            const filteredVals = vals.filter(function(el) {
                return el != null;
            });
            console.log(filteredVals);

            const datesArr = [];
            // if(this.currentAccount.id == )
            dates.forEach((res: any) => {
                if (res != null) {
                    const jsdate = new Date(res._i);
                    datesArr.push(jsdate.toLocaleTimeString('en', { day: 'numeric', month: 'numeric' }));
                }
            });
            // console.log(datesArr);

            let keys = datesArr;
            let values = filteredVals;

            let result = {};
            let pairDateValue = keys.map(function(x, i) {
                return { dates: x, values: values[i] };
            });
            console.log(pairDateValue);
            let arrD = [];
            let arrV = [];
            for (let dateval of pairDateValue.sort()) {
                console.log(dateval.dates);
                arrD.push(dateval.dates);
                arrV.push(dateval.values);
            }
            console.log(arrD);
            console.log(arrV);

            this.chart = new Chart('lineCharts', {
                type: 'bar',
                data: {
                    labels: arrD,
                    datasets: [
                        {
                            label: '# kilograms',
                            data: arrV,
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
