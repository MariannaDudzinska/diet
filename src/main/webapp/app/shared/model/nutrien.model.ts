import { IFood } from 'app/shared/model//food.model';

export interface INutrien {
    id?: number;
    nutrient?: string;
    unit?: string;
    value?: number;
    gm?: number;
    food?: IFood;
}

export class Nutrien implements INutrien {
    constructor(
        public id?: number,
        public nutrient?: string,
        public unit?: string,
        public value?: number,
        public gm?: number,
        public food?: IFood
    ) {}
}
