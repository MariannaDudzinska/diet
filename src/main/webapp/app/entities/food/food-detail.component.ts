import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsumption } from 'app/shared/model/food.model';

@Component({
    selector: 'jhi-food-detail',
    templateUrl: './food-detail.component.html'
})
export class FoodDetailComponent implements OnInit {
    consumption: IConsumption;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ consumption }) => {
            this.consumption = consumption;
        });
    }

    previousState() {
        window.history.back();
    }
}
