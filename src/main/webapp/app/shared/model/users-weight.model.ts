import { Moment } from 'moment';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface IUsersWeight {
    id?: number;
    dateOfLog?: Moment;
    valueInKg?: number;
    userExtra?: IUserExtra;
}

export class UsersWeight implements IUsersWeight {
    constructor(public id?: number, public dateOfLog?: Moment, public valueInKg?: number, public userExtra?: IUserExtra) {}
}
