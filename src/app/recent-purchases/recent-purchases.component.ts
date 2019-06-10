import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-recent-purchases',
  templateUrl: './recent-purchases.component.html',
  styleUrls: ['./recent-purchases.component.scss']
})
export class RecentPurchasesComponent implements OnInit {
  user: any;
  items: any;
  storeID: string;
  dates = [];
  firstShipped: any = [];
  firstNoShipped: any = [];
  shipped: any;
  datesShipping = [];
  showMore = false;
  showLess = false;
  showMoreNoShipped = false;
  showLessNoShipped = false;
  showLoading = true;
  showProduct = false;
  showShipped = false;
  showDelivered = false;
  showCancelled = false;
  firstProducts: any;
  min = new Date();
  max = new Date();
  today = new Date();
  index: any;
  citemId: any;
  action: string;
  where: any;
  trackingForm: FormGroup;
  extra: FormArray;
  fileToUpload: any = [];
  invoice: FormControl;
  healthCert: FormControl;
  packingList: FormControl;
  awb: FormControl;
  certificateOrigin: FormControl;
  creditNote: FormControl;
  files: any;
  itemId: any;
  subindex: any;
  delivered: any = [];
  cancelled: any = [];
  label6: any = 'Select a file to attach...';
  label5: any = 'Select a file to attach...';
  label4: any = 'Select a file to attach...';
  label3: any = 'Select a file to attach...';
  label2: any = 'Select a file to attach...';
  label1: any = 'Select a file to attach...';
  shippingIndex: any;
  shippingSubindex: any;
  public loading = false;
  doc: any = [];
  API: any = environment.apiURL;
  tmpFiles: any = [];
  deliveryID: any;
  deliveryIndex: any;
  deliverySunindex: any;
  public selectedMoment: any = new Date();


  constructor(private productS: ProductService, private toast: ToastrService, private auth: AuthenticationService, public ngProgress: NgProgress, private formBuilder: FormBuilder) {
    this.min.setDate(this.today.getDate());
    this.max.setDate(this.today.getDate() + 90);
  }

  ngOnInit() {
    this.setHeight();
    this.createFormControl();
    this.createForm();
    this.user = this.auth.getLoginData();
    this.getStore();
  }

  chargeJS() {
    console.log(jQuery('#slidinTab'));
    // Sliding underline effect
    let $el, leftPos, newWidth;
    const $mainNav: any = jQuery('#slidinTab');

    $mainNav.append('<li id=\'magic-line\'></li>');

    jQuery('#magic-line').css('position', 'absolute');
    jQuery('#magic-line').css('background', '#094D82');
    jQuery('#magic-line').css('height', '2px');
    jQuery('#magic-line').css('width', '280px');
    jQuery('#magic-line').css('left', '0');
    jQuery('#magic-line').css('bottom', '-2px');
    jQuery('#magic-line').css('border-radius', '2px');
    /* Cache it */
    const $magicLine = jQuery('#magic-line');


    jQuery('#slidinTab li a').click(function () {
      $el = jQuery(this);
      leftPos = $el.position().left;
      newWidth = $el.width();

      $magicLine.stop().animate({
        left: leftPos,
        // width: newWidth
      });
    });


    jQuery('img.order-icon').each(function () {
      const $img = jQuery(this);
      const imgID = $img.attr('id');
      const imgClass = $img.attr('class');
      const imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        let $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
        }


        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });

  }
  getStore() {
    this.productS.getData('api/store/user/' + this.user.id).subscribe(
      result => {
        this.storeID = result[0].id;
        this.getPurchases();
        this.getPurchasesShipped();
        this.getDelivered();
        this.getCancelled();
      },
      e => {
        console.log(e);
      }
    );
  }
  getPurchases() {
    // this.productS.getData('api/store/fish/paid/'+this.storeID).subscribe(
    this.productS.getData(`api/store/orders/not-shipped/user/${this.user.id}`).subscribe(
      result => {
        console.log(result);
        if (result && result !== '') {
          this.items = result;
          this.firstNoShipped = result; console.log(result);

          this.showLoading = false;
          this.showProduct = true;
          setTimeout(() => this.chargeJS(), 1000);

          // this.getFirstNoShipped();
          // this.getDates();
        } else {
          this.showProduct = false;
          this.showLoading = false;
        }
      },
      e => {
        this.showProduct = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getPurchasesShipped() {
    // this.productS.getData('api/store/fish/items/paid/' + this.storeID).subscribe(
    this.productS.getData(`api/store/orders/shipped/user/${this.user.id}`).subscribe(
      result => {
        console.log('Shipped', result);
        if (result && result !== '') {
          this.shipped = result;
          this.firstShipped = result;

          this.showShipped = true;
          // this.getFirstPurchases();
          this.getDatesShipped();
        } else {
          this.showShipped = false;
        }
      },
      e => {
        this.showShipped = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getFirstPurchases() {
    this.firstShipped = [];
    this.shipped.forEach((data, index) => {
      if (index <= 10) {
        this.firstShipped[index] = data;
      }
    });
    if (this.shipped.length > 10) {
      this.showMore = true;
      this.showLess = false;
    } else {
      this.showMore = false;
      this.showLess = false;
    }
  }
  getAllPurchases() {
    this.showMore = false;
    this.showLess = true;
    this.firstShipped = this.shipped;

  }
  getFirstNoShipped() {
    this.firstNoShipped = [];
    this.items.forEach((data, index) => {
      if (index <= 3) {
        this.firstNoShipped[index] = data;
      }
    });
    if (this.items.length > 3) {
      this.showMoreNoShipped = true;
      this.showLessNoShipped = false;
    } else {
      this.showMoreNoShipped = false;
      this.showLessNoShipped = false;
    }
  }
  getAllNoShipped() {
    this.showMoreNoShipped = false;
    this.showLessNoShipped = true;
    this.firstNoShipped = this.items;
  }
  getDates() {
    this.items.forEach((data, index) => {
      // convert date
      const date = new Date(data.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let hours = date.getHours();
      const min = date.getMinutes();
      let minutes;
      if (min < 10) {
        minutes = '0' + min;
      } else {
        minutes = min;
      }
      let ampm = 'AM';
      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }
      this.dates[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }
  getDatesShipped() {
    this.shipped.forEach((data, index) => {
      // convert date
      const date = new Date(data.shoppingCart.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let hours = date.getHours();
      const min = date.getMinutes();
      let minutes;
      if (min < 10) {
        minutes = '0' + min;
      } else {
        minutes = min;
      }
      let ampm = 'AM';
      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }
      this.datesShipping[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }


  // Confirm order function
  confirmOrder(itemId: string, subindex?) {
    const index = this.index;
    const sellerETA = jQuery(`#epa${itemId}`).val();

    this.productS.updateData('api/itemshopping/' + itemId + '/5c017af047fb07027943a405',
      { userEmail: this.user['email'], userID: this.user['id'], sellerExpectedDeliveryDate: sellerETA }).subscribe(
        res => {
          jQuery('#confirm').modal('hide');
          console.log(res);
          this.toast.success(res['message'], 'Alert', { positionClass: 'toast-top-right' });
          if (subindex !== undefined) {
            this.firstNoShipped[index].items[subindex].updateInfo = res['item'][0].updateInfo;

          } else {
            this.firstNoShipped[index].items[0].updateInfo = res['item'][0].updateInfo;

          }



        },
        e => {
          this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
        }
      );



  }


  // Show Modal for Confirm order
  showModal(id, action, index, where, subindex?) {
    const sellerETA = jQuery(`#epa${id}`).val();
    this.index = index;
    this.where = where;
    this.subindex = subindex;
    console.log('index Modal', this.index);

    if ((sellerETA !== '' && sellerETA !== undefined) || action === 'cancel') {
      this.citemId = id;
      this.action = action;

      jQuery('#confirm').modal('show');
    } else {
      this.toast.error('Please select a Expected Delivery Time before Confirm the order', 'Error', { positionClass: 'toast-top-right' });
    }
  }

  // Confirm action in the modal
  confirm(val, action) {
    if (val) {
      console.log(action);
      if (action === 'confirm') {
        this.confirmOrder(this.citemId);
      } else if (action === 'cancel') {
        this.cancelOrder(this.citemId);
      }
    } else {
      jQuery('#confirm').modal('hide');
    }
  }


  // Cancel an order
  cancelOrder(itemId: string) {
    const status = {
      'id': itemId,
      'status': '5c06f4bf7650a503f4b731fd'
    };

    this.productS.updateData(`api/itemshopping/${status.id}/${status.status}`,
      { userEmail: this.user['email'], userID: this.user['id'] }).subscribe(res => {

        console.log(res, this.subindex);
        jQuery('#confirm').modal('hide');
        this.toast.success('Order Canceled', 'Well Done', { positionClass: 'toast-top-right' });
        if (this.where === 'pending') {
          if (this.subindex !== undefined) {
            console.log('indefinida');
            this.firstNoShipped[this.index].items.splice(this.subindex, 1);

          } else {
            console.log('Definida');
            this.firstNoShipped.splice(this.index, 1);


          }
        } else {
          if (this.subindex !== undefined) {
            this.firstShipped[this.index].items.splice(this.subindex, 1);

          } else {
            this.firstShipped.splice(this.index, 1);

          }

        }
        this.cancelled = [];
        this.getCancelled();
      },
        e => {
          this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
        });
  }

  // Function to open calendar to confirm order
  selectDate(id, index, subindex?) {
    this.index = index;
    const date = jQuery('#epa' + id).val();
    console.log('Item ID', id, date);
    if (subindex !== undefined) {
      this.confirmOrder(id, subindex);

    } else {
      this.confirmOrder(id);

    }

  }

  // Open set delivery date modal
  openDeliveryModal(id, index, subindex?) {
    jQuery('#deliveryModal').modal('show');
    this.deliveryID = id;
    this.deliveryIndex = index;
    this.deliverySunindex = subindex;
  }

  // Create form controls and shipping docs form

  createFormControl() {
    this.invoice = new FormControl('');
    this.healthCert = new FormControl('');
    this.packingList = new FormControl('');
    this.awb = new FormControl('');
    this.certificateOrigin = new FormControl('');
    this.creditNote = new FormControl('');
  }

  createForm() {
    this.trackingForm = this.formBuilder.group({
      invoice: this.invoice,
      healthCert: this.healthCert,
      packingList: this.packingList,
      awb: this.awb,
      certificateOrigin: this.certificateOrigin,
      creditNote: this.creditNote,
      extra: this.formBuilder.array([])

    }, {
        updateOn: 'submit'
      });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      filename: '',
      fileextra: ''
    });
  }

  addItem(): void {
    this.extra = this.trackingForm.get('extra') as FormArray;
    this.extra.push(this.createItem());
    console.log('Extra', this.trackingForm.get('extra').value);
  }

  // Validate each input fields of the form

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  // Check if form is valid
  saveTracking() {

    if (this.trackingForm.valid) {
      console.log('PDFs validos');
      console.log(this.trackingForm.value);
      this.loading = true;
      this.ngProgress.start();
      this.sendToAPI();
    } else {
      this.validateAllFormFields(this.trackingForm);
    }
  }


  // Save docs in DATABASE
  async sendToAPI() {
    const data = [
      this.trackingForm.get('invoice').value,
      this.trackingForm.get('healthCert').value,
      this.trackingForm.get('packingList').value,
      this.trackingForm.get('awb').value,
      this.trackingForm.get('certificateOrigin').value,
      this.trackingForm.get('creditNote').value
    ];


    for (const file of data) {
      console.log('File', file);
      if (file !== '' && file != null) {
        const contents = await this.postFile(file);
        }

    }

    console.log('Mostrar items');

    if (this.where === 'pending') {
      if (this.shippingSubindex !== undefined) {
        console.log('indefinida');
        this.firstNoShipped[this.shippingIndex].items[this.shippingSubindex].shippingFiles = this.tmpFiles;


      } else {
        console.log('Definida');
        this.firstNoShipped[this.shippingIndex].items[0].shippingFiles = this.tmpFiles;


      }
    } else {
      if (this.shippingSubindex !== undefined) {
        this.firstShipped[this.shippingIndex].items[this.shippingSubindex].shippingFiles = this.tmpFiles;


      } else {
        this.firstShipped[this.shippingIndex].items[0].shippingFiles = this.tmpFiles;

      }

    }
    console.log('Extra vacio', this.extra);
    if (this.extra !== undefined) {
      if (this.extra.length > 0) {
        await this.saveExtraDocs();
      }
    }


    this.toast.success('Order marked as document fulfillment!', 'Upload Succesfully', { positionClass: 'toast-top-right' });
      jQuery('#shippingDocs').modal('hide');
      this.doc = [];
      this.cleanLabels();
      this.loading = false;
      this.ngProgress.done();



  }

  async saveExtraDocs() {

    await new Promise((resolve) => {
    for (let i = 0; i < this.extra.length; i++) {
      console.log(this.extra.at(i).value);
      const item = this.extra.at(i).value;

      this.postFile(item['fileextra']);
      if ((i + 1) === this.extra.length) {
        console.log('Se resolvio');
        resolve();
      }

    }
    });

  }

  // Function to prepulate current shiiping docs uploaded to the server
  getShippingDocs() {
    if (this.where === 'pending') {
      if (this.shippingSubindex !== undefined) {
        this.doc = this.firstNoShipped[this.shippingIndex].items[this.shippingSubindex].shippingFiles;


      } else {
        console.log('Definida');
        this.doc = this.firstNoShipped[this.shippingIndex].items[0].shippingFiles;


      }
    } else {
      if (this.shippingSubindex !== undefined) {
        this.doc = this.firstShipped[this.shippingIndex].items[this.shippingSubindex].shippingFiles;


      } else {
        this.doc = this.firstShipped[this.shippingIndex].items[0].shippingFiles;

      }

    }
    console.log('Doc', this.doc);
  }

  public mapDocs(doc, name) {
    const file = doc.split('/');
    if (file[3] !== undefined && file[3].includes(name)) {
      return `<a download href="${this.API}api/itemshopping/${file[2]}/shipping-documents/${file[3]}/"><i class="fa fa-file-o" aria-hidden="true"></i> ${file[3]}</a>`;
    }
  }

  hasContent(element: string) {
    if (document.getElementById(element).innerHTML !== null) {
      return true;
    }
  }

  async postFile(element) {
    await new Promise((resolve) => {

      this.productS.uploadPDF(element, this.itemId).subscribe(res => {
        console.log(res);
        this.tmpFiles = res;
        resolve();

      }, error => {
        console.log(error);
        resolve();
      });

    });
  }

  cleanLabels() {
    this.label1 = 'Select a file to attach...';
    this.label2 = 'Select a file to attach...';
    this.label3 = 'Select a file to attach...';
    this.label4 = 'Select a file to attach...';
    this.label5 = 'Select a file to attach...';
    this.label6 = 'Select a file to attach...';
    this.tmpFiles = [];
    this.trackingForm.reset();
    jQuery('#shippingDocs input[type=file]').val('');
  }
  // Get file on input change and change the name before upload it
  removeAllButLast(string, token) {
    /* Requires STRING not contain TOKEN */
    const parts = string.split(token);
    return parts.slice(0, -1).join('') + token + parts.slice(-1);
}
  handleFileInput(event, name) {


    if (event.target.files.length > 0) {
      const file = event.target.files;
      const tmpNameFile = this.removeAllButLast(file[0].name, '.');
      console.log('File', tmpNameFile);

      const ext = tmpNameFile.split('.');
      console.log(ext);
      console.log('Nombre', name + '.' + ext[1]);

      const blob = file[0].slice(0, file[0].size, file[0].type);
      console.log(blob);
      const newFile = new File([blob], name  + '-' + ext[0] + '.' + ext[1], { type: file[0].type });

      console.log('newFile', newFile);
      // file[0].name=name;

      this.trackingForm.get(`${name}`).setValue(newFile);
      if (name === 'invoice') {
        this.label1 = ext[0] + '.' + ext[1];
      } else if (name === 'healthCert') {
        this.label2 = ext[0] + '.' + ext[1];
      } else if (name === 'packingList') {
        this.label3 = ext[0] + '.' + ext[1];

      } else if (name === 'awb') {
        this.label4 = ext[0] + '.' + ext[1];

      } else if (name === 'certificateOrigin') {
        this.label5 = ext[0] + '.' + ext[1];

      } else {
        this.label6 = ext[0] + '.' + ext[1];
      }
    }
  }

  renameFilename(file, name) {
    return file.renameFilename = name + '.' + file['name'].split('.').pop();
  }

  // Open shipping docs modal
  openShippingModal(id, index, where, subindex?) {
    jQuery('#shippingDocs').modal('show');
    console.log('index', index, subindex);
    this.itemId = id;
    this.shippingIndex = index;
    this.where = where;
    if (subindex !== undefined) {
      this.shippingSubindex = subindex;
    }
    this.getShippingDocs();

  }

  // Close shipping docs modal
  closeShippingModal() {
    jQuery('#shippingDocs').modal('hide');
    this.doc = [];
  }

  // Get delivered orders

  getDelivered() {
    this.productS.getData(`/api/store/${this.user.id}/order/status/5c017b3c47fb07027943a409`).subscribe(res => {
      console.log('Delivered Orders', res);
      const arr: any = res;
      if (arr.length > 0) {
        this.delivered = res;
        this.showDelivered = true;
      }
    });
  }

  // Get cancelled orders

  getCancelled() {
    this.productS.getData(`/api/store/${this.user.id}/order/status/5c06f4bf7650a503f4b731fd`).subscribe(res => {
      console.log('Delivered Orders', res);
      const arr: any = res;
      if (arr.length > 0) {
        this.cancelled = res;
        this.showCancelled = true;
      }
    });
  }

  public orderForOrder(prop: string) {
    if (this[prop + '_sort'] === null || this[prop + '_sort'] === undefined) {
      this[prop + '_sort'] = 'desc';
    }

    if (this[prop + '_sort'] === 'desc') {
      this[prop] = this[prop].sort((a, b) => {
        return a.orderNumber - b.orderNumber;
      });
      this[prop + '_sort'] = 'asc';
    } else {
      this[prop] = this[prop].sort((a, b) => {
        return b.orderNumber - a.orderNumber;
      });
      this[prop + '_sort'] = 'desc';
    }

  }

  public orderForDate(prop: string) {
    if (this[prop + '_sort_date'] === null || this[prop + '_sort_date'] === undefined) {
      this[prop + '_sort_date'] = 'desc';
    }

    if (this[prop + '_sort_date'] === 'desc') {
      this[prop] = this[prop].sort((a, b) => {
        return a.updatedAt - b.updatedAt;
      });
      this[prop + '_sort_date'] = 'asc';
    } else {
      this[prop] = this[prop].sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });
      this[prop + '_sort_date'] = 'desc';
    }

  }


  public getTotal(order) {
    let total = 0;
    if (isNaN(order.currentCharges.exchangeRates) === false) {
      total = order.total / order.currentCharges.exchangeRates;
    }
    if (
      Object.prototype.toString.call(order.currentCharges.exchangeRates) === '[object Array]' &&
      order.currentCharges.exchangeRates.length > 0
    ) {
      total = order.total / order.currentCharges.exchangeRates[0].price;
    }
    if (isNaN(Number(total)) === true) {
      return 'not available';
    }
    return total.toFixed(2) + ' USD';
  }

  public getTotalItem(item, order) {
    let result;
    try {
      let exchangeRates = 0;
      if (isNaN(order.currentCharges.exchangeRates) === false) {
        exchangeRates = Number(order.currentCharges.exchangeRates);
      }
      if (
        Object.prototype.toString.call(order.currentCharges.exchangeRates) === '[object Array]' &&
        order.currentCharges.exchangeRates.length > 0
      ) {
        exchangeRates = Number(order.currentCharges.exchangeRates[0].price);
      }
      result = (Number(item.total) / exchangeRates).toFixed(2);
    } catch (e) {
      console.error(e);
    }

    if (isNaN(Number(result)) === true) {
      return 'not available';
    }
    return result + ' USD';
  }

  logCalendar() {
    console.log('Momento', this.selectedMoment);
    jQuery(`#epa${this.deliveryID}`).val(this.selectedMoment);
    console.log(jQuery(`#epa${this.deliveryID}`).val());
    this.selectDate(this.deliveryID, this.deliveryIndex, this.deliverySunindex);
    jQuery('#deliveryModal').modal('hide');
  }

  onExtraChange(event, name, index) {


    if (event.target.files.length > 0) {
      const file = event.target.files;
      const ext = file[0].name.split('.');
      console.log(ext);
      console.log('Nombre', name + '.' + ext[1]);

      const blob = file[0].slice(0, file[0].size, file[0].type);
      console.log(blob);
      const newFile = new File([blob], name  + '-extra'  + '.' + ext[1], { type: file[0].type });

      console.log('newFile', newFile);

     this.extra.at(index).setValue(
        {
          filename: name,
          fileextra: newFile
        }
      );
      console.log('Extra updated', this.extra.value);


    }
  }

  setHeight() {
    const screenHeight = window.screen.height - 410;

    document.getElementById('panel').style.minHeight = screenHeight + 'px';
  }
}
