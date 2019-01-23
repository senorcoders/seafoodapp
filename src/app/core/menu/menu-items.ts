import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  translate: any;
}
export interface Menu {
  state: string;
  type: string;
  translate: any;
  children?: ChildrenItems[];
}
const menuAdmin = [
  {
    state: 'users',
    type: 'sub',
    children: [
      { state: 'admin', name: 'Admins', translate: { en: { name: 'Admins' }, ar: { name: 'Admins' } } },
      { state: 'seller', name: 'Sellers', translate: { en: { name: 'Sellers' }, ar: { name: 'Sellers' } } },
      { state: 'buyer', name: 'Buyers', translate: { en: { name: 'Buyers' }, ar: { name: 'Buyers' } } },
      { state: 'verify-users', name: 'Verify Users', translate: { en: { name: 'Verify Users' }, ar: { name: 'Verify Users' } } }
    ],
    translate: {
      en: {
        name: 'Users'
      },
      ar: {
        name: 'Users'
      }
    }
  },
  {
    state: 'orders',
    type: 'sub',
    children: [
      { state: 'manage-orders', name: 'Manage Orders', translate: { en: { name: 'Manage Orders' }, ar: { name: 'Manage Orders' } } },
      /*{ state: 'seller-fulfills-orders', name: 'Seller Fulfills Orders', translate: { en: { name: 'Seller Fulfills Orders' }, ar: { name: 'Seller Fulfills Orders' } } },
      { state: 'orders-shipped', name: 'Orders Shipped', translate: { en: { name: 'Orders Shipped' }, ar: { name: 'Orders Shipped' } } },
      { state: 'orders-arrived', name: 'Orders Arrived', translate: { en: { name: 'Orders Arrived' }, ar: { name: 'Orders Arrived' } } },
      { state: 'orders-out-for-delivery', name: 'Orders Out for Delivery', translate: { en: { name: 'Orders Out for Delivery' }, ar: { name: 'Order Out for Delivery' } } },
      //{ state: 'orders-delivered', name: 'Orders delivered', translate: { en: { name: 'Orders delivered' }, ar: { name: 'Orders delivered' } } },
      { state: 'payments', name: 'Payments', translate: { en: { name: 'Payments' }, ar: { name: 'Payments' } } },
      { state: 'repayments', name: 'Repayments', translate: { en: { name: 'Repayments' }, ar: { name: 'Repayments' } } },
      { state: 'refund-cases', name: 'Refund Cases', translate: { en: { name: 'Refund Cases' }, ar: { name: 'Refund Cases' } } },
      { state: 'refunds', name: 'Refunds', translate: { en: { name: 'Refunds' }, ar: { name: 'Refunds' } } }*/
    ],
    translate: {
      en: {
        name: 'Orders'
      },
      ar: {
        name: 'Orders'
      }
    }
  },
  {
    state: 'admin-changes',
    type: 'sub',
    translate: {
      en: {
        name: 'Admin Changes'
      },
      ar: {
        name: 'Admin Changes'
      }
    },
    children: [
      {
        state: 'comments',
        type: 'link',
        name: 'Comments',
        translate: {
          en: {
            name: 'Comment'
          },
          ar: {
            name: 'Comment'
          }
        }
      },
      {
        state: 'shipping-rates',
        type: 'link',
        name: 'Shipping',
        translate: {
          en: {
            name: 'Shipping'
          },
          ar: {
            name: 'Shipping'
          }
        }
      },
      {
        state: 'pricing-charges',
        type: 'link',
        name: 'Pricing charges',
        translate: {
          en: {
            name: 'Pricing Charges'
          },
          ar: {
            name: 'Pricing Charges'
          }
        }
      },
      {
        state: 'manage-countries',
        type: 'link',
        name: 'Manage Countries ETA',
        translate: {
          en: {
            name: 'Manage Countries ETA'
          },
          ar: {
            name: 'Manage Countries ETA'
          }
        }
      },
    ]
  },
  {
    state: 'product-managment',
    type: 'sub',
    name: 'Product Managment',
    translate: {
      en: {
        name: 'Product Managment'
      },
      es: {
        name: 'Product Managment'
      }
    },
    children: [
      {
        state: 'products/all/1',
        type: 'link',
        name: 'Browse Products',
        translate: {
          en: {
            name: 'Browse Products'
          },
          ar: {
            name: 'Browse Products'
          }
        }
      },
      {
        state: 'products-list/page/1',
        type: 'link',
        name: 'Product List',
        translate: {
          en: {
            name: 'Product List'
          },
          ar: {
            name: 'Product List'
          }
        }
      },
      {
        state: 'pending-products',
        type: 'link',
        name: 'Pending Approval',
        translate: {
          en: {
            name: 'Pending Approval'
          },
          ar: {
            name: 'Pending Approval'
          }
        }
      }
    ]
  },
  {
    state: 'fish-type',
    type: 'link',
    translate: {
      en: {
        name: 'Fish Type'
      },
      ar: {
        name: 'Fish Type'
      }
    }
  },
  {
    state: 'featured',
    type: 'sub',
    children: [
      { state: 'featured-seller', name: 'Featured  Seller', translate: { en: { name: 'Featured  Seller' }, ar: { name: 'Featured  Seller' } } },
      { state: 'featured-products', name: 'Featured  Products', translate: { en: { name: 'Featured Products' }, ar: { name: 'Featured Products' } } },
      { state: 'featured-types', name: 'Featured  Types', translate: { en: { name: 'Featured Types' }, ar: { name: 'Featured Types' } } },
      { state: 'fish-types-menu', name: 'Fish Types menu', translate: { en: { name: 'Fish Types menu' }, ar: { name: 'Fish Types menu' } } },
      { state: 'chart', name: 'Purchases Charts', translate: { en: { name: 'Purchases Charts' }, ar: { name: 'Purchases Charts' } } },
      { state: 'documents', name: 'Upload Document', translate: { en: { name: 'Upload Document' }, ar: { name: 'Upload Document' } } }
    ],
    translate: {
      en: {
        name: 'Featured'
      },
      ar: {
        name: 'Featured'
      }
    }
  }
];
const menu = [
  {
    state: 'login',
    type: 'link',
    translate: {
      en: {
        name: 'Login'
      },
      ar: {
        name: 'Login'
      }
    }
  },
  {
    state: 'register',
    type: 'link',
    translate: {
      en: {
        name: 'Register'
      },
      ar: {
        name: 'Register'
      }
    }
  }
];
const menuSeller = [
  {
    state: 'recent-purchases',
    type: 'link',
    translate: {
      en: {
        name: 'Orders'
      },
      ar: {
        name: 'Orders'
      }
    }
  },
  {
    state: 'products',
    type: 'sub',
    children: [
      { state: 'add-product', name: 'add new', translate: { en: { name: 'Add New' }, ar: { name: 'Add New' } } },
      { state: 'my-products', name: 'my products', translate: { en: { name: 'My Products' }, ar: { name: 'My Products' } } }
    ],
    translate: {
      en: {
        name: 'My Products'
      },
      ar: {
        name: 'My Products'
      }
    }
  }
];
const menuBuyer = [
  {
    state: 'products/all/1',
    type: 'link',
    translate: {
      en: {
        name: 'Shop'
      },
      ar: {
        name: 'Shop'
      }
    }
  },
  {
    state: 'cart',
    type: 'link',
    translate: {
      en: {
        name: 'Cart'
      },
      ar: {
        name: 'Cart'
      }
    }
  }, {
    state: 'my-orders',
    type: 'sub',
    children: [
      {
        state: 'orders',
        name: 'My Orders',
        translate: { en: { name: 'My Orders' }, ar: { name: 'My Orders' } }
      },
      {
        state: 'items-status',
        name: 'Items Status',
        translate: { en: { name: 'Items Status' }, ar: { name: 'Items Status' } }
      },
      {
        state: 'canceled-delivered-items',
        name: 'Canceled & Delivered Items',
        translate: { en: { name: 'Canceled Delivered Status' }, ar: { name: 'Canceled Delivered Items' } }
      }
    ],
    translate: {
      en: {
        name: 'My Orders'
      },
      ar: {
        name: 'My Orders'
      }
    }
  }
];
const menuFooter = [
  {
    state: 'account',
    type: 'link',
    translate: {
      en: {
        name: 'Profile'
      },
      ar: {
        name: 'Profile'
      }
    }
  },
  {
    state: 'favorites',
    type: 'link',
    translate: {
      en: {
        name: 'Favorites'
      },
      ar: {
        name: 'Favorites'
      }
    }
  },
  {
    state: 'orders',
    type: 'link',
    translate: {
      en: {
        name: 'My Orders'
      },
      ar: {
        name: 'My Orders'
      }
    }
  }, {
    state: 'browse',
    type: 'link',
    translate: {
      en: {
        name: 'Browse'
      },
      ar: {
        name: 'Browse'
      }
    }
  },
  {
    state: 'sfspay',
    type: 'link',
    translate: {
      en: {
        name: 'SFSPay'
      },
      ar: {
        name: 'SFSPay'
      }
    }
  },
  {
    state: 'help',
    type: 'link',
    translate: {
      en: {
        name: 'Help'
      },
      ar: {
        name: 'Help'
      }
    }
  },
  {
    state: 'contact-us',
    type: 'link',
    translate: {
      en: {
        name: 'Contact us'
      },
      ar: {
        name: 'Contact us'
      }
    }
  },
  {
    state: 'guides',
    type: 'link',
    translate: {
      en: {
        name: 'Guides'
      },
      ar: {
        name: 'Guides'
      }
    }
  },
  {
    state: 'terms-conditions',
    type: 'link',
    translate: {
      en: {
        name: 'Terms & Conditions'
      },
      ar: {
        name: 'Terms & Conditions'
      }
    }
  },
  {
    state: 'about-us',
    type: 'link',
    translate: {
      en: {
        name: 'About us'
      },
      ar: {
        name: 'About us'
      }
    }
  }
];
const menuFooterNoLogin = [
  {
    state: 'home',
    type: 'link',
    translate: {
      en: {
        name: 'Homepage'
      },
      ar: {
        name: 'Homepage'
      }
    }
  },
  {
    state: 'register',
    type: 'link',
    translate: {
      en: {
        name: 'Seller Register'
      },
      ar: {
        name: 'Seller Register'
      }
    }
  },
  {
    state: 'register',
    type: 'link',
    translate: {
      en: {
        name: 'Buyer Register'
      },
      ar: {
        name: 'Buyer Register'
      }
    }
  },
  {
    state: 'login',
    type: 'link',
    translate: {
      en: {
        name: 'Login'
      },
      ar: {
        name: 'Login'
      }
    }
  },
  {
    state: 'home',
    type: 'link',
    translate: {
      en: {
        name: 'Browse'
      },
      ar: {
        name: 'Browse'
      }
    }
  },
  {
    state: 'sfspay',
    type: 'link',
    translate: {
      en: {
        name: 'SFSPay'
      },
      ar: {
        name: 'SFSPay'
      }
    }
  },
  {
    state: 'help',
    type: 'link',
    translate: {
      en: {
        name: 'Help'
      },
      ar: {
        name: 'Help'
      }
    }
  },
  {
    state: 'contact-us',
    type: 'link',
    translate: {
      en: {
        name: 'Contact us'
      },
      ar: {
        name: 'Contact us'
      }
    }
  },
  {
    state: 'guides',
    type: 'link',
    translate: {
      en: {
        name: 'Guides'
      },
      ar: {
        name: 'Guides'
      }
    }
  },
  {
    state: 'terms-conditions',
    type: 'link',
    translate: {
      en: {
        name: 'Terms & Conditions'
      },
      ar: {
        name: 'Terms & Conditions'
      }
    }
  },
  {
    state: 'about-us',
    type: 'link',
    translate: {
      en: {
        name: 'About us'
      },
      ar: {
        name: 'About us'
      }
    }
  },
  {
    state: 'register',
    type: 'link',
    translate: {
      en: {
        name: 'Company registration and contact details'
      },
      ar: {
        name: 'Company registration and contact details'
      }
    }
  },
];
@Injectable()
export class MenuItems {
  getSellerMenu(): Menu[] {
    return menuSeller;
  }
  getbuyerMenu(): Menu[] {
    return menuBuyer;
  }
  getMenu(): Menu[] {
    return menu;
  }
  getMenuFooter1(): Menu[] {
    return menuFooter;
  }
  getMenuFooterNoLogin(): Menu[] {
    return menuFooterNoLogin;
  }
  addMenuItem(Menu: Menu) {
    menuBuyer.push(Menu);
    // menuSeller.push(Menu);
  }
  getMenuAdmin(): Menu[] {
    return menuAdmin;
  }
}
