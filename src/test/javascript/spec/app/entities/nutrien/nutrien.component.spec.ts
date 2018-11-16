/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EnginDietTestModule } from '../../../test.module';
import { NutrienComponent } from 'app/entities/nutrien/nutrien.component';
import { NutrienService } from 'app/entities/nutrien/nutrien.service';
import { Nutrien } from 'app/shared/model/nutrien.model';

describe('Component Tests', () => {
    describe('Nutrien Management Component', () => {
        let comp: NutrienComponent;
        let fixture: ComponentFixture<NutrienComponent>;
        let service: NutrienService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [NutrienComponent],
                providers: []
            })
                .overrideTemplate(NutrienComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(NutrienComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(NutrienService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Nutrien(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.nutriens[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
