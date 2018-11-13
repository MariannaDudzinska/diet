/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EnginDietTestModule } from '../../../test.module';
import { UsersWeightDeleteDialogComponent } from 'app/entities/users-weight/users-weight-delete-dialog.component';
import { UsersWeightService } from 'app/entities/users-weight/users-weight.service';

describe('Component Tests', () => {
    describe('UsersWeight Management Delete Component', () => {
        let comp: UsersWeightDeleteDialogComponent;
        let fixture: ComponentFixture<UsersWeightDeleteDialogComponent>;
        let service: UsersWeightService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [UsersWeightDeleteDialogComponent]
            })
                .overrideTemplate(UsersWeightDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UsersWeightDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UsersWeightService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
