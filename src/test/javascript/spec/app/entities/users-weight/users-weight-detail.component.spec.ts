/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnginDietTestModule } from '../../../test.module';
import { UsersWeightDetailComponent } from 'app/entities/users-weight/users-weight-detail.component';
import { UsersWeight } from 'app/shared/model/users-weight.model';

describe('Component Tests', () => {
    describe('UsersWeight Management Detail Component', () => {
        let comp: UsersWeightDetailComponent;
        let fixture: ComponentFixture<UsersWeightDetailComponent>;
        const route = ({ data: of({ usersWeight: new UsersWeight(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [UsersWeightDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UsersWeightDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UsersWeightDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.usersWeight).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
