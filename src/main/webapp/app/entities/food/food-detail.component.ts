import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFood } from 'app/shared/model/food.model';

@Component({
    selector: 'jhi-food-detail',
    templateUrl: './food-detail.component.html'
})
export class FoodDetailComponent implements OnInit {
    food: IFood;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ food }) => {
            this.food = food;
        });
    }

    previousState() {
        window.history.back();
    }
}
