/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EnginDietTestModule } from '../../../test.module';
import { NutrienDeleteDialogComponent } from 'app/entities/nutrien/nutrien-delete-dialog.component';
import { NutrienService } from 'app/entities/nutrien/nutrien.service';

describe('Component Tests', () => {
    describe('Nutrien Management Delete Component', () => {
        let comp: NutrienDeleteDialogComponent;
        let fixture: ComponentFixture<NutrienDeleteDialogComponent>;
        let service: NutrienService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [NutrienDeleteDialogComponent]
            })
                .overrideTemplate(NutrienDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(NutrienDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NutrienService);
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
