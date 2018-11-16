/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { EnginDietTestModule } from '../../../test.module';
import { NutrienUpdateComponent } from 'app/entities/nutrien/nutrien-update.component';
import { NutrienService } from 'app/entities/nutrien/nutrien.service';
import { Nutrien } from 'app/shared/model/nutrien.model';

describe('Component Tests', () => {
    describe('Nutrien Management Update Component', () => {
        let comp: NutrienUpdateComponent;
        let fixture: ComponentFixture<NutrienUpdateComponent>;
        let service: NutrienService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [NutrienUpdateComponent]
            })
                .overrideTemplate(NutrienUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(NutrienUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NutrienService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Nutrien(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.nutrien = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Nutrien();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.nutrien = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
