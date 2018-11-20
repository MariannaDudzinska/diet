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
                    datesArr.push(jsdate.toISOString().substring(0, 10));
                }
            });
            // console.log(datesArr);

            const keys = datesArr;
            const values = filteredVals;

            const result = {};
            const pairDateValue = keys.map(function(x, i) {
                return { dates: x, values: values[i] };
            });
            const sortedArrOfObj = pairDateValue.sort(function(a, b) {
                a = a.dates;
                b = b.dates;
                return a > b ? 1 : a < b ? -1 : 0;
            });
            console.log(sortedArrOfObj);
            const arrD = [];
            const arrV = [];
            for (const dateval of sortedArrOfObj) {
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
                                'rgba(83, 243, 174, 1)',
                                'rgba(13, 191, 114, 1)',
                                'rgba(40, 123, 87, 1)',
                                'rgba(55, 154, 88, 1)',
                                'rgba(29, 180, 79, 1)',
                                'rgba(83, 243, 174, 1)',
                                'rgba(59, 171, 122, 1)',
                                'rgba(40, 118, 84, 1)',
                                'rgba(23, 68, 49, 1)',
                                'rgba(34, 195, 125, 1)',
                                'rgba(46, 133, 62, 1)',
                                'rgba(95, 200, 115, 1)'
                            ],
                            fill: false,
                            lineTension: 0.2,
                            borderWidth: 0.5
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
