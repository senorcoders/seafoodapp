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
  state:'comments',
  type: 'link',
  translate:{
    en:{
      name:'Comment'
    },
    es:{
      name:'Comentarios'
    }
  }
},
{
  state:'users',
  type: 'sub',
  children:[
  {state:'admin', name:"Admins", translate:{en:{name:"Admins"}, es:{name:"Admins"}}},
  {state:'seller', name:"Sellers", translate:{en:{name:"Sellers"}, es:{name:"Vendedores"}}},
  {state:'buyer', name:"Buyers", translate:{en:{name:"Buyers"}, es:{name:"Compradores"}}},
  {state:'verify-users', name:"Verify Users", translate:{en:{name:"Verify Users"}, es:{name:"Verificar Usuarios"}}}
  ],
  translate:{
    en:{
      name:'Users'
    },
    es:{
      name:'Usuarios'
    }
  }
},
{
  state:'products',
  type: 'link',
  translate:{
    en:{
      name:'Products'
    },
    es:{
      name:'Productos'
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
    {state:'featured-products', name:'Featured  Products',translate:{en:{name:'Featured Products'},es:{name:'Productos Destacados'}}},
    {state:'featured-types', name:'Featured  Types',translate:{en:{name:'Featured Types'},es:{name:'Tipos Destacados'}}},
    {state:'chart', name:'Purchases Charts',translate:{en:{name:'Purchases Charts'},es:{name:'Gráficos de ventas'}}},
    {state:'documents', name:'Upload Document',translate:{en:{name:'Upload Document'},es:{name:'Subir Documentos'}}}
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
  state:'recent-purchases',
  type: 'link',
  translate:{
    en:{
      name:'Recent Purchases'
    },
    es:{
      name:'Compras Recientes'
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
  state:'documents',
  type: 'link',
  translate:{
    en:{
      name:'Documents'
    },
    es:{
      name:'Documentos'
    }
  }
}
];
const menuBuyer=[
{
  state:'favorites',
  type: 'link',
  translate:{
    en:{
      name:'Favorites'
    },
    es:{
      name:'Favoritos'
    }
  }
},
{
  state:'orders',
  type: 'link',
  translate:{
    en:{
      name:'My Orders'
    },
    es:{
      name:'Mis Compras'
    }
  }
}
];
const menuFooter=[
  {
    state:"account",
    type:"link",
    translate:{
      en:{
        name: 'Profile'
      },
      es:{
        name:'Perfil'
      }
    }
  },
  {
    state:"favorites",
    type:"link",
    translate:{
      en:{
        name: 'Favorites'
      },
      es:{
        name:'Favoritos'
      }
    }
  },
  {
    state:"orders",
    type:"link",
    translate:{
      en:{
        name: 'My Orders'
      },
      es:{
        name:'Mis compras'
      }
    }
  },{
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Browse'
      },
      es:{
        name:'Navegar'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'SFSPay'
      },
      es:{
        name:'SFSPay'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Help'
      },
      es:{
        name:'Ayuda'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Contact us'
      },
      es:{
        name:'Contáctanos'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Guides'
      },
      es:{
        name:'Guías'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Terms & Conditions'
      },
      es:{
        name:'Términos y Condiciones'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'About us'
      },
      es:{
        name:'Sobre Nosotros'
      }
    }
  }
];
const menuFooterNoLogin=[
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Homepage'
      },
      es:{
        name:'Inicio'
      }
    }
  },
  {
    state:"register",
    type:"link",
    translate:{
      en:{
        name: 'Seller Register'
      },
      es:{
        name:'Registrarse como Vendedor'
      }
    }
  },
  {
    state:"register",
    type:"link",
    translate:{
      en:{
        name: 'Buyer Register'
      },
      es:{
        name:'Registrarse como Comprador'
      }
    }
  },
  {
    state:"login",
    type:"link",
    translate:{
      en:{
        name: 'Login'
      },
      es:{
        name:'Iniciar sesión'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Browse'
      },
      es:{
        name:'Navegar'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'SFSPay'
      },
      es:{
        name:'SFSPay'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Help'
      },
      es:{
        name:'Ayuda'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Contact us'
      },
      es:{
        name:'Contáctanos'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Guides'
      },
      es:{
        name:'Guías'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'Terms & Conditions'
      },
      es:{
        name:'Términos y Condiciones'
      }
    }
  },
  {
    state:"home",
    type:"link",
    translate:{
      en:{
        name: 'About us'
      },
      es:{
        name:'Sobre Nosotros'
      }
    }
  },
  {
    state:"register",
    type:"link",
    translate:{
      en:{
        name: 'Company registration and contact details'
      },
      es:{
        name:'Registro de empresa y detalles de contacto'
      }
    }
  },
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
    return menuFooter;
  }
  getMenuFooterNoLogin():Menu[]{
    return menuFooterNoLogin;
  }
  addMenuItem(Menu:Menu){
    menuBuyer.push(Menu);
    // menuSeller.push(Menu);
  }
  getMenuAdmin():Menu[]{
    return menuAdmin;
  }
}