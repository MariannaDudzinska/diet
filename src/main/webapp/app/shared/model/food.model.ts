import { Moment } from 'moment';
import { INutrien } from 'app/shared/model//nutrien.model';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface IConsumption {
    id?: number;
    foodNbdbo?: string;
    foodName?: string;
    quantity?: number;
    dateOfConsumption?: Moment;
    contains?: INutrien[];
    userExtraFood?: IUserExtra;
}

export class Consumption implements IConsumption {
    constructor(
        public id?: number,
        public foodNbdbo?: string,
        public foodName?: string,
        public quantity?: number,
        public dateOfConsumption?: Moment,
        public contains?: INutrien[],
        public userExtraFood?: IUserExtra
    ) {}
}
