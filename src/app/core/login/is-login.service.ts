import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class IsLoginService {
    public isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public role: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    setLogin(value: boolean, role: number) {
        this.isLogged.next(value);
        this.role.next(role)
    }
}