import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxLookupComponent } from 'devextreme-angular';
import locates from 'country-state-city';
import { Router } from '@angular/router';
// Lenguaje
import { locale, loadMessages } from 'devextreme/localization';
import * as esMessages from 'devextreme/localization/messages/es.json';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TypeUserEnum, TypeSupplierEnum, TypePreservationEnum, TypeUnitMeasureEnum } from 'src/app/shared/util/enum';

@Component({
  selector: 'app-availability-products',
  templateUrl: './availability-products.component.html',
  styleUrls: ['./availability-products.component.scss']
})
export class AvailabilityProductsComponent implements OnInit {

  @ViewChild('gridConfig') gridConfig: DxDataGridComponent;
  public textFilterReset;
  public textSaveRow;
  public textCancelRow;
  public textCancelAllRow;
  public textEditRow;
  public textDeleteRow;
  public textDeleteConfirm;
  public nameFiltersRow = {};
  public refreshMode: string;
  public data;
  public Viewdisabled = true;
  public lstProducts = [];
  public lstSupplier = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router) {
    this.refreshMode = 'reshape';
    this.translate.get('AvailabilityProducts').subscribe((res: string) => {
      this.excelTitle = res;
    });
    if (
      this.translate.currentLang === 'es'
    ) {
      // Lenguaje grilla devExpress
      loadMessages(esMessages);
      locale('es');
      this.nameFiltersRow = {
        between: 'Entre',
        contains: 'Contiene',
        endsWith: 'Termina con',
        equal: 'Igual',
        greaterThan: 'Mayor que',
        greaterThanOrEqual: 'Mayor o igual que',
        lessThan: 'Menor que',
        lessThanOrEqual: 'Menor o igual que',
        notContains: 'No contiene',
        notEqual: 'No es igual',
        startsWith: 'Empieza con'
      };
      this.textSaveRow = 'Guardar';
      this.textEditRow = 'Editar';
      this.textDeleteRow = 'Eliminar';
      this.textFilterReset = 'Limpiar';
      this.textCancelRow = 'Cancelar';
      this.textCancelAllRow = 'Cancelar';
      this.textDeleteConfirm = '¿Desea eliminar el registro?';
    } else {
      locale('en');
      this.textFilterReset = 'Reset';
      this.textSaveRow = 'Save';
      this.textEditRow = 'Edit';
      this.textDeleteRow = 'Delete';
      this.textCancelRow = 'Cancel';
      this.textCancelAllRow = 'Cancel';
      this.textDeleteConfirm = 'Do you want to delete the record?';
    }
    this.getFilterProducts = this.getFilterProducts.bind(this);
    this.getFilterSuppliers = this.getFilterSuppliers.bind(this);
  }

  onRowUpdating(e) {
    if (!this.valRowCell(e)) {
      e.cancel = true;
      e.isValid = false;
    }
  }

  onRowInserting(e) {
    this.isAllowDeleting = true;
    if (!this.valRowCell(e)) {
      e.cancel = true;
      e.isValid = false;
    }
  }

  customizeText(e) {
    return '$' + e.value;
  }

  onInitNewRow(e) {
    this.isAllowDeleting = false;
    let maxid = 0;
    const grid: any = this.gridConfig.dataSource;
    grid.map(function (obj) {
      if (obj.ID > maxid) {
        maxid = obj.ID;
      }
    });
    e.data.ID = maxid + 1;
  }

  async onRowUpdated(e) {
    const model = this.createObjectConfiguration(e, true);
    console.log(model);
  }

  async onRowInserted(e) {
    const model = this.createObjectConfiguration(e, false);
    console.log(model);
  }

  async onKeyDown(e) {
    if (e.event.key === 'Escape') {
      this.isAllowDeleting = true;
    }
  }


  async onRowRemoved(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {

    }
  }

  onCellPrepared(e) {
    if (
      !this.isAllowDeleting &&
      e.column.command === 'edit' &&
      e.column.type === 'buttons' &&
      e.cellElement.innerText === 'Eliminar '
    ) {
      e.cellElement.hidden = true;
    }
     }


  onRowPrepared(e) {

  }




  createObjectConfiguration(e, updated: boolean): any {
    const model = {
      ID: updated ? e.data.ID : -1,
      IDProvider: e.data.IDProvider,
      IDProduct: e.data.IDProduct,
      Quantity: e.data.Quantity,
      UnitValue: e.data.UnitValue,
      ExpirationDate: e.data.ExpirationDate
    };
    return model;

  }

  valRowCell(e): boolean {
    let ID: any;
    let IDProvider: any;
    let IDProduct: any;
    let boolState = true;

    if (e.data) {
      IDProvider = e.data.IDProvider ? e.data.IDProvider : null;
      IDProduct = e.data.IDProduct ? e.data.IDProduct : null;

    } else {
      ID = e.oldData.ID;
      IDProvider = e.newData.IDProvider
        ? e.newData.IDProvider
        : e.oldData.IDProvider;
        IDProduct = e.newData.IDProduct
        ? e.newData.IDProduct
        : e.oldData.IDProduct;
    }
    if (
      this.valRowGrid(
        ID,
        IDProvider,
        IDProduct
      )
    ) {
      boolState = false;
    }
    return boolState;
  }

  valRowGrid(
    ID, IDProvider,
    IDProduct): boolean {
    const grid: any = this.gridConfig.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.IDProvider === IDProvider &&
        item.IDProduct === IDProduct);
    if (gridValidate.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
   this.loadCatalog();
  }

  async loadCatalog() {
    this.loadSuppliers();
    this.loadProducts();
    await this.getData();
  }

   onValueChanged(e) {
   }

  async getData() {
  this.data = [{
    ID: 1,
    IDProvider: 12,
    IDProduct: 1,
    Quantity: 23,
    UnitValue: 12000,
    ExpirationDate: '2020/08/05'
  },
  {
    ID: 2,
    IDProvider: 12,
    IDProduct: 2,
    Quantity: 12,
    UnitValue: 1200,
    ExpirationDate: '2020/09/05'
  },
  {
    ID: 2,
    IDProvider: 13,
    IDProduct: 3,
    Quantity: 13,
    UnitValue: 1200,
    ExpirationDate: '2020/09/06'
  },
];

    /*
    let response
    if (response != null) {
      this.data = response;
      this.lstSetting = this.data;
    }
    */

  }



  onEditorPreparing(e) {
  }

  onEditorPrepared(e) {
  }



  async loadProducts() {
   this.lstProducts = [{
    ID: 1,
    Code: '01',
    Name: 'Producto1',
    Description: 'Producto1',
    Preservation: 0,
    MeasurementUnit: 1
  },
  {
    ID: 2,
    Code: '02',
    Name: 'Producto2',
    Description: 'Producto2',
    Preservation: 1,
    MeasurementUnit: 2
  },
  {
    ID: 3,
    Code: '03',
    Name: 'Producto3',
    Description: 'Producto3',
    Preservation: 0,
    MeasurementUnit: 3
  }
  ];
  }

  getFilterProducts() {
    return {
      store: this.lstProducts,
      paginate: true,
      loadMode: 'raw'
    };
  }
  getFilterSuppliers() {
    return {
      store: this.lstSupplier,
      paginate: true,
      loadMode: 'raw'
    };
  }


  async loadSuppliers() {
    this.lstSupplier = [{
      ID: 12,
      Code: 'PROV1',
      Name: 'Proveedor1',
      NIT: '1022388263',
      Address: 'Calle falsa 123',
      Phone: 1234545,
      Email: 'Jhonatan@hagonfnm.com',
      Contact: 'Jhonatan',
      ContactMail: 'Jhonatan@hagonfnm.com',
      ContactPhone: 123466,
      EnterpriseMail: 'Jhonatan@hagonfnm.com',
      City: 1,
      Neighborhood: 'Fatima',
      Type: 0
    },
    {
      ID: 13,
      Code: 'PROV2',
      Name: 'Proveedor2',
      NIT: '1022388264',
      Address: 'Calle falsa 123',
      Phone: 1234545,
      Email: 'Jhonatan@hagonfnm.com',
      Contact: 'Jhonatan',
      ContactMail: 'Jhonatan@hagonfnm.com',
      ContactPhone: 123466,
      EnterpriseMail: 'Jhonatan@hagonfnm.com',
      City: 1,
      Neighborhood: 'Fatima',
      Type: 1
    }
    ];
  }

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }
}
