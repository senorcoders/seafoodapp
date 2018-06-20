import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  translate:any;
}
export interface Menu {
  state: string;
  type: string;
  translate:any;
  children?: ChildrenItems[],
}
const menuAdmin=[
{
  state:'account',
  type: 'link',
  translate:{
    en:{
      name:'Profile'
    },
    es:{
      name:'Perfil'
    }
  }
},
{
  state:'admin',
  type: 'link',
  translate:{
    en:{
      name:'Admin'
    },
    es:{
      name:'Admin'
    }
  }
},
{
  state:'products',
  type: 'sub',
  children:[
    {state:'add-product', name:'add new', translate:{en:{name:'Add New'},es:{name:'Agregar'}}},
    {state:'my-products', name:'my products',translate:{en:{name:'My Products'},es:{name:'Mis Productos'}}}
  ],
  translate:{
    en:{
      name:'My Products'
    },
    es:{
      name:'Mis Productos'
    }
  }
},
{
  state:'fish-type',
  type: 'link',
  translate:{
    en:{
      name:'Fish Type'
    },
    es:{
      name:'Tipos de Pescados'
    }
  }
},
{
  state:'featured',
  type:'sub',
  children:[
    {state:'featured-seller', name:'Featured  Seller', translate:{en:{name:'Featured  Seller '},es:{name:'Vendedores Destacados'}}},
    {state:'featured-products', name:'Featured  Products',translate:{en:{name:'Featured Products'},es:{name:'Productos Destacados'}}}
  ],
    translate:{
    en:{
      name:'Featured'
    },
    es:{
      name:'Destacados'
    }
  }
}
]
const menu=[
{
  state:'login',
  type: 'link',
  translate:{
    en:{
      name:'Login'
    },
    es:{
      name:'Iniciar Session'
    }
  }
},
{
  state:'register',
  type: 'link',
  translate:{
    en:{
      name:'Register'
    },
    es:{
      name:'Registrarse'
    }
  }
}
];
const menuSeller=[
{
  state:'account',
  type: 'link',
  translate:{
    en:{
      name:'Profile'
    },
    es:{
      name:'Perfil'
    }
  }
},
{
  state:'products',
  type: 'sub',
  children:[
    {state:'add-product', name:'add new', translate:{en:{name:'Add New'},es:{name:'Agregar'}}},
    {state:'my-products', name:'my products',translate:{en:{name:'My Products'},es:{name:'Mis Productos'}}}
  ],
  translate:{
    en:{
      name:'My Products'
    },
    es:{
      name:'Mis Productos'
    }
  }
},
{
  state:'fish-type',
  type: 'link',
  translate:{
    en:{
      name:'Fish Type'
    },
    es:{
      name:'Tipos de Pescados'
    }
  }
}
];
const menuBuyer=[
{
  state:'account',
  type: 'link',
  translate:{
    en:{
      name: 'Profile'
    },
    es:{
      name:'Perfil'
    }
  }
}
];
const menuFooter1=[
  {
    state:"",
    type:"link",
    translate:{
      en:{
        name: 'Homepage'
      },
      es:{
        name:'Página Principal'
      }
    }
  },
  {
    state:"about",
    type:"link",
    translate:{
      en:{
        name: 'About us'
      },
      es:{
        name:'Nosotros'
      }
    }
  },
  {
    state:"faq",
    type:"link",
    translate:{
      en:{
        name: 'FAQ'
      },
      es:{
        name:'FAQ'
      }
    }
  },
  {
    state:"policy",
    type:"link",
    translate:{
      en:{
        name: 'Policy'
      },
      es:{
        name:'Políticas'
      }
    }
  }
];
const menuFooter2=[
  {
    state:"shipping-information",
    type:"link",
    translate:{
      en:{
        name: 'Shipping Information'
      },
      es:{
        name:'Información sobre compras'
      }
    }
  },
  {
    state:"support",
    type:"link",
    translate:{
      en:{
        name: 'Support'
      },
      es:{
        name:'Soporte'
      }
    }
  },
  {
    state:"wholesale-seafood",
    type:"link",
    translate:{
      en:{
        name: 'Wholesale Seafood'
      },
      es:{
        name:'Mariscos'
      }
    }
  }
]
@Injectable()
export class MenuItems {
  getSellerMenu():Menu[]{
    return menuSeller;
  }
  getbuyerMenu():Menu[]{
    return menuBuyer;
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
    menuBuyer.push(Menu);
    // menuSeller.push(Menu);
  }
  getMenuAdmin():Menu[]{
    return menuAdmin;
  }
}