import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsersWeight } from 'app/shared/model/users-weight.model';

@Component({
    selector: 'jhi-users-weight-detail',
    templateUrl: './users-weight-detail.component.html'
})
export class UsersWeightDetailComponent implements OnInit {
    usersWeight: IUsersWeight;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ usersWeight }) => {
            this.usersWeight = usersWeight;
        });
    }

    previousState() {
        window.history.back();
    }
}
