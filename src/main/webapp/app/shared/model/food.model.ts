import { Moment } from 'moment';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface IConsumption {
    id?: number;
    foodNbdbo?: string;
    foodName?: string;
    quantity?: number;
    dateOfConsumption?: Moment;
    userExtraFood?: IUserExtra;
}

export class Consumption implements IConsumption {
    constructor(
        public id?: number,
        public foodNbdbo?: string,
        public foodName?: string,
        public quantity?: number,
        public dateOfConsumption?: Moment,
        public userExtraFood?: IUserExtra
    ) {}
}
