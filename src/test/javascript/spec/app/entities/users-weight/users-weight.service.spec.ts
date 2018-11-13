/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { UsersWeightService } from 'app/entities/users-weight/users-weight.service';
import { IUsersWeight, UsersWeight } from 'app/shared/model/users-weight.model';

describe('Service Tests', () => {
    describe('UsersWeight Service', () => {
        let injector: TestBed;
        let service: UsersWeightService;
        let httpMock: HttpTestingController;
        let elemDefault: IUsersWeight;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(UsersWeightService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new UsersWeight(0, currentDate, 0);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        dateOfLog: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a UsersWeight', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        dateOfLog: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        dateOfLog: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new UsersWeight(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a UsersWeight', async () => {
                const returnedFromService = Object.assign(
                    {
                        dateOfLog: currentDate.format(DATE_FORMAT),
                        valueInKg: 1
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        dateOfLog: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of UsersWeight', async () => {
                const returnedFromService = Object.assign(
                    {
                        dateOfLog: currentDate.format(DATE_FORMAT),
                        valueInKg: 1
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        dateOfLog: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a UsersWeight', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
