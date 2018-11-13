import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUsersWeight } from 'app/shared/model/users-weight.model';
import { UsersWeightService } from './users-weight.service';

@Component({
    selector: 'jhi-users-weight-delete-dialog',
    templateUrl: './users-weight-delete-dialog.component.html'
})
export class UsersWeightDeleteDialogComponent {
    usersWeight: IUsersWeight;

    constructor(
        private usersWeightService: UsersWeightService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.usersWeightService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'usersWeightListModification',
                content: 'Deleted an usersWeight'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-users-weight-delete-popup',
    template: ''
})
export class UsersWeightDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ usersWeight }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UsersWeightDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.usersWeight = usersWeight;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
