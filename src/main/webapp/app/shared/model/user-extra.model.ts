import { IUsersWeight } from 'app/shared/model//users-weight.model';
import { IUser } from 'app/core/user/user.model';
import { IFood } from 'app/shared/model//food.model';

export enum STYLE {
    SITTING = 'SITTING',
    AVERAGE = 'AVERAGE',
    ACTIVE = 'ACTIVE'
}

export enum DIETMODE {
    BALANCED = 'BALANCED',
    LOSE = 'LOSE',
    GAIN = 'GAIN'
}

export interface IUserExtra {
    id?: number;
    weight?: number;
    height?: number;
    lifestyle?: STYLE;
    dietMode?: DIETMODE;
    usersWeights?: IUsersWeight[];
    user?: IUser;
    foods?: IFood[];
}

export class UserExtra implements IUserExtra {
    constructor(
        public id?: number,
        public weight?: number,
        public height?: number,
        public lifestyle?: STYLE,
        public dietMode?: DIETMODE,
        public usersWeights?: IUsersWeight[],
        public user?: IUser,
        public foods?: IFood[]
    ) {}
}
