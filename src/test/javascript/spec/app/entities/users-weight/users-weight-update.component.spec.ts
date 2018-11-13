/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { EnginDietTestModule } from '../../../test.module';
import { UsersWeightUpdateComponent } from 'app/entities/users-weight/users-weight-update.component';
import { UsersWeightService } from 'app/entities/users-weight/users-weight.service';
import { UsersWeight } from 'app/shared/model/users-weight.model';

describe('Component Tests', () => {
    describe('UsersWeight Management Update Component', () => {
        let comp: UsersWeightUpdateComponent;
        let fixture: ComponentFixture<UsersWeightUpdateComponent>;
        let service: UsersWeightService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [UsersWeightUpdateComponent]
            })
                .overrideTemplate(UsersWeightUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UsersWeightUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UsersWeightService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new UsersWeight(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.usersWeight = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new UsersWeight();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.usersWeight = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
