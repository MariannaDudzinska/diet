import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { Principal } from 'app/core';
import { SearchResult, Log, Food } from './session.model';
import { SessionsService } from './sessions.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'jhi-sessions',
    templateUrl: './sessions.component.html'
})
export class SessionsComponent implements OnInit {
    @ViewChild('input')
    input: ElementRef; // To select input element

    withRefresh = false;
    foods: SearchResult[];
    foods$: Observable<SearchResult[]>;
    fetchedFood$: Observable<Food>;

    private searchText$ = new Subject<string>();
    search(packageName: string) {
        this.searchText$.next(packageName);
    }
    ngOnInit() {
        this.foods$ = this.searchText$.pipe(
            debounceTime(250),
            distinctUntilChanged(),
            switchMap(packageName => {
                console.log(packageName);
                console.log(this.foods$);
                return this.logsService.search(packageName);
            })
        );
    }

    onModal(id, name: String) {
        this.fetchedFood$ = this.logsService.fetchFood(id);
        // this.modalService.open(name);
        return this.fetchedFood$;
    }

    constructor(private logsService: SessionsService) {}

    /* NIEWAŻNE póki co*/
    /*  this.logsService.getFoodList().subscribe(response => (this.foodList = response));
  console.log(JSON.stringify(this.response, null, '    '));
  console.log(this.foodList);
  /*

  /*        Observable.fromEvent(this.input.nativeElement, 'keyup')
            .map((e: any) => e.target.value)
            .filter((text: string) => text.length > 1)
            .debounceTime(250)
            .do((query: string) => this.store.dispatch(new Actions.Search(query)))
            .switch()
            .subscribe();

      this.logsService.getFoodListConsole().subscribe((data: any[]) => {
      this.items = data;
      console.log('JSON : ');
      console.log(data);
  });*/
}
