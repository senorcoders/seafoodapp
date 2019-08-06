import { Injectable } from '@angular/core';
declare var jQuery: any;

@Injectable()
export class ToastrService {

  public idTime = 0;

  constructor() { }

  private checkSnack() {
    let snack = document.querySelector("app-root #snackbar");
    if (snack === null) {
      let div = document.createElement("div");
      div.setAttribute("id", "snackbar");
      document.querySelector("app-root").appendChild(div);
      snack = div;
    }
    return snack;
  }

  public show(message: string, title?: string, options?: any, type?: string) {
    options = options || {};
    let _options = Object.assign({
      duration: 3000 //Por el momento solo puede ser 3 segundos, porque en el css eso dilata la animación
    }, options);
    //Quitamos cualquiera de los tipos
    let snack = this.checkSnack();
    snack.classList.remove("error");
    snack.classList.remove("success");

    if (snack.classList.contains("show") === true) {
      clearTimeout(this.idTime);
      snack.innerHTML = message;
    } else {
      snack.className = "show";
      snack.innerHTML = message;
    }
    //Asigamos el type
    if (type) snack.classList.add(type);

    //Asignamos el margin dependiendo del witdh
    let width = $(snack).width();
    $(snack).css("marginLeft", (width/2)*-1);

    this.assingTime(snack, _options.duration);
  }

  public success(message: string, title?: string, options?: any) {
    title = title || "";
    options = options || {};
    this.show(message, title, options, "success");
  }

  public error(message: string, title?: string, options?: any) {
    title = title || "";
    options = options || {};
    this.show(message, title, options, "error");
  }

  private assingTime(snack, time) {
    let idTime = setTimeout(() => {
      snack.innerHTML = '';
      snack.className = snack.className.replace("show", "");
    }, time);
    this.idTime = idTime as any;
  }

}
