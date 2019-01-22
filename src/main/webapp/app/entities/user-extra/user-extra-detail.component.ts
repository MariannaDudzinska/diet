import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserExtra } from 'app/shared/model/user-extra.model';

@Component({
    selector: 'jhi-user-extra-detail',
    templateUrl: './user-extra-detail.component.html'
})
export class UserExtraDetailComponent implements OnInit {
    userExtra: IUserExtra;
    calsNeed: number;
    proteinNeed: number;
    fatNeed: number;
    carbsNeed: number;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
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
    }

    previousState() {
        window.history.back();
    }
    Round(n, k) {
        const factor = Math.pow(10, k);
        return Math.round(n * factor) / factor;
    }
}
