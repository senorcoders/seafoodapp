import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filternumber'
})
export class FilternumberPipe implements PipeTransform {

  transform(res: any[], searchText: any): any[] {
    if(!res) return []; 
    if(!searchText) return res;
searchText = searchText.toLowerCase();
return res.filter((item:any) => { 
  console.log("Filter", item);
  if(item.hasOwnProperty('orderNumber')){
    return item.orderNumber == searchText

  }else{
    return item.shoppingCart.orderNumber == searchText

  }

    });
   }

}
