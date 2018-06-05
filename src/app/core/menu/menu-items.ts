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
    {state:'my-products', name:'My Products'},
    {state:'add-category', name:'Add Category'},
    {state:'edit-category', name:'Edit Category'}
  ]
},
{
  state:'search',
  name: 'Search Products',
  type: 'link',
}
];
const menuFooter1=[
  {
    state:"",
    name:"Homepage",
    type:"link"
  },
  {
    state:"about",
    name:"About us",
    type:"link"
  },
  {
    state:"faq",
    name:"FAQ",
    type:"link"
  },
  {
    state:"policy",
    name:"Policy",
    type:"link"
  }
];
const menuFooter2=[
  {
    state:"shipping-information",
    name:"Shipping Information",
    type:"link"
  },
  {
    state:"support",
    name:"Support",
    type:"link"
  },
  {
    state:"wholesale-seafood",
    name:"Wholesale Seafood",
    type:"link"
  }
]
@Injectable()
export class MenuItems {
  getLoginMenu():Menu[]{
    return menuLogin;
  }
  getMenu():Menu[]{
    return menu;
  }
  getMenuFooter1():Menu[]{
    return menuFooter1;
  }
    getMenuFooter2():Menu[]{
    return menuFooter2;
  }
  addMenuItem(Menu:Menu){
    menu.push(Menu);
    menuLogin.push(Menu);
  }
}