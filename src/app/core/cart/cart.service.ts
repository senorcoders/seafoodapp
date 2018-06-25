import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CartService {
    public cart: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    setCart(cart: any) {
        this.cart.next(cart);
    }
}