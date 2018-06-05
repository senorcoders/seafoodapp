import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class IsLoginService {
    public isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    setLogin(value: boolean) {
        this.isLogged.next(value);
    }
}