/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnginDietTestModule } from '../../../test.module';
import { FoodDetailComponent } from 'app/entities/food/food-detail.component';
import { Consumption } from 'app/shared/model/food.model';

describe('Component Tests', () => {
    describe('Food Management Detail Component', () => {
        let comp: FoodDetailComponent;
        let fixture: ComponentFixture<FoodDetailComponent>;
        const route = ({ data: of({ food: new Consumption(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [FoodDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(FoodDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FoodDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.consumption).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
