import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INutrien } from 'app/shared/model/nutrien.model';
import { NutrienService } from './nutrien.service';

@Component({
    selector: 'jhi-nutrien-delete-dialog',
    templateUrl: './nutrien-delete-dialog.component.html'
})
export class NutrienDeleteDialogComponent {
    nutrien: INutrien;

    constructor(private nutrienService: NutrienService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.nutrienService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'nutrienListModification',
                content: 'Deleted an nutrien'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-nutrien-delete-popup',
    template: ''
})
export class NutrienDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ nutrien }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(NutrienDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.nutrien = nutrien;
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
