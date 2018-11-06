import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipePipe implements PipeTransform {

  transform(res: any[], searchText: string): any[] {
    if(!res) return []; 
    if(!searchText) return res;
searchText = searchText.toLowerCase();
return res.filter(({items}) => {
    return items.some(({fish}) => fish.name.toLowerCase().includes(searchText)) 

    });
   }
}
