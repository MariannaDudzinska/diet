/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EnginDietTestModule } from '../../../test.module';
import { UsersWeightComponent } from 'app/entities/users-weight/users-weight.component';
import { UsersWeightService } from 'app/entities/users-weight/users-weight.service';
import { UsersWeight } from 'app/shared/model/users-weight.model';

describe('Component Tests', () => {
    describe('UsersWeight Management Component', () => {
        let comp: UsersWeightComponent;
        let fixture: ComponentFixture<UsersWeightComponent>;
        let service: UsersWeightService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [EnginDietTestModule],
                declarations: [UsersWeightComponent],
                providers: []
            })
                .overrideTemplate(UsersWeightComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UsersWeightComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UsersWeightService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new UsersWeight(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.usersWeights[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
