import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { Principal } from 'app/core';
import { SearchResult, Log, Food } from './session.model';
import { SessionsService } from './sessions.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { FoodService } from '../../entities/food/food.service';

@Component({
    selector: 'jhi-sessions',
    templateUrl: './sessions.component.html'
})
export class SessionsComponent implements OnInit {
    @ViewChild('input')
    input: ElementRef; // To select input element

    withRefresh = false;
    foods: SearchResult[] = [];
    foods$: Observable<SearchResult[]>;
    fetchedFood$: Observable<Food>;
    foodList: Observable<SearchResult[]>;
    private searchField: FormControl;
    foodService: FoodService;
    results: any;

    private searchText$ = new Subject<string>();
    search(packageName: string) {
        this.searchText$.next(packageName);
    }
    ngOnInit() {
        this.foods$ = this.searchText$.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(packageName => {
               /* console.log(packageName);
                console.log(this.foods$);*/
                return this.logsService.search(packageName);
            })
        );
        this.searchField = new FormControl();
        this.foodList = this.searchField.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(searchPhrase => {
              /*  console.log(searchPhrase);
                console.log(this.foodList);*/
                return this.logsService.search(searchPhrase);
            }),
            map(foodList => {
                this.setFoods(foodList);
                return foodList;
            }),
        );
       /* console.log('co zwraca this foods$ ');
        console.log(this.foods$);*/

    }
    setFoods(foodList) {
        this.foods = foodList;
    }

    onModal(id) {
        this.logsService.fetchFood(id).subscribe( res => {
            this.results = res.nutrients;
            return this.results;
        });
    }

    constructor(private logsService: SessionsService,  foodService: FoodService) {}

    fetchFoodData(id) {
        this.foodService.fetchFood(id).subscribe( nutrientsArray => {
            const caloriesNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '208');
            const caloriesValue = Number(caloriesNutrient.value);

            const proteinNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '203');
            const proteinValue = Number(proteinNutrient.value);

            const fatsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '204');
            const fatsValue = Number(fatsNutrient.value);

            const carbsNutrient = nutrientsArray.find(nutrient => nutrient.nutrient_id === '205');
            const carbsValue = Number(carbsNutrient.value);
        });
    }
}
