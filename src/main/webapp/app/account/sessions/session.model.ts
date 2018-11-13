export class Log {
    constructor(public id: string, public name: string) {}
}

export interface ISearchResult {
    id: string;
    name: string;
}

export class SearchResult implements ISearchResult {
    id: string;
    name: string;
    constructor(obj?: any) {
        this.id = obj.ndbno || '';
        this.name = obj.name || '';
    }
}

export interface Nutrients {
    nutrient_id: string;
    nutrient: string;
    unit: string;
    value: number;
    gm: number;
}
export interface IFood {
    id: string;
    name: string;
    nutrients: Nutrients[];
}

export class Food implements IFood {
    id: string;
    name: string;
    nutrients: Nutrients[];
    constructor(obj?: any) {
        this.id = obj.ndbno || '';
        this.name = obj.name || '';
        this.nutrients = obj.nutrients || [];
    }
}
