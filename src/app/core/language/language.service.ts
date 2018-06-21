import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LanguageService {
    public language: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    setLanguage(value: any) {
        this.language.next(value)
    }
}