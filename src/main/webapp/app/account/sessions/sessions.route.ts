import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { SessionsComponent } from './sessions.component';

export const sessionsRoute: Route = {
    path: 'sessions',
    component: SessionsComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Search products info'
    },
    canActivate: [UserRouteAccessService]
};
