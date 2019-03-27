import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TitleService {
  private title = new BehaviorSubject<String>('Seafood Souq');
  private title$ = this.title.asObservable();

  constructor() { }
  public setTitle(title: String) {
    this.title.next(title);
  }

  public getTitle(): Observable<String> {
    return this.title$;
  }
}
