import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conversion'
})
export class ConversionPipe implements PipeTransform {

  transform(value: any, args?: any, param2?:any): any {
    console.log("Argumento", args, value, param2);
    switch (args) {
      case 'g':
        return Number(value / 1000) + 'G';
        break;
        case 'box':
        return parseInt((value / param2).toString()) + (((value / param2) > 1) ? ' boxes' : ' box');
          break;
      default:
      return null;
    } 
    
   
  }

}
