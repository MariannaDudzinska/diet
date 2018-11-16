import { Moment } from 'moment';
import { INutrien } from 'app/shared/model//nutrien.model';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface IFood {
    id?: number;
    name?: string;
    quantity?: number;
    dateOfConsumption?: Moment;
    contains?: INutrien[];
    userExtraFood?: IUserExtra;
}

export class Food implements IFood {
    constructor(
        public id?: number,
        public name?: string,
        public quantity?: number,
        public dateOfConsumption?: Moment,
        public contains?: INutrien[],
        public userExtraFood?: IUserExtra
    ) {}
}
