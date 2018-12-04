import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class OrdersService {
    public hasOrders: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null)
    //public Orders: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    setOrders(value: boolean) {
        this.hasOrders.next(value);
        //this.Orders.next(orders);
    }
}