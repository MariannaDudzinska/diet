import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INutrien } from 'app/shared/model/nutrien.model';

@Component({
    selector: 'jhi-nutrien-detail',
    templateUrl: './nutrien-detail.component.html'
})
export class NutrienDetailComponent implements OnInit {
    nutrien: INutrien;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ nutrien }) => {
            this.nutrien = nutrien;
        });
    }

    previousState() {
        window.history.back();
    }
}
