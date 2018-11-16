/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnginDietTestModule } from '../../../test.module';
import { NutrienDetailComponent } from 'app/entities/nutrien/nutrien-detail.component';
import { Nutrien } from 'app/shared/model/nutrien.model';

describe('Component Tests', () => {
    describe('Nutrien Management Detail Component', () => {
        let comp: NutrienDetailComponent;
        let fixture: ComponentFixture<NutrienDetailComponent>;
        const route = ({ data: of({ nutrien: new Nutrien(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [NutrienDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(NutrienDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(NutrienDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.nutrien).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
