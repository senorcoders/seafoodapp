import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  children?: ChildrenItems[];
}
const menu=[
{
  state:'search',
  name: 'Search Products',
  type: 'link',
},
{
  state:'login',
  name: 'Login',
  type: 'link',
},
{
  state:'register',
  name: 'Register',
  type: 'link',
}
];
const menuLogin=[
{
  state:'account',
  name: 'Account Information',
  type: 'link',
},
  {
  state:'products',
  name: 'My Products',
  type: 'sub',
  children:[
    {state:'add-product', name:'Add New'},
    {state:'list-product', name:'List Product'}
  ]
},
{
  state:'search',
  name: 'Search Products',
  type: 'link',
}
];
@Injectable()
export class MenuItems {
  getLoginMenu():Menu[]{
    return menuLogin;
  }
  getMenu():Menu[]{
    return menu;
  }
}