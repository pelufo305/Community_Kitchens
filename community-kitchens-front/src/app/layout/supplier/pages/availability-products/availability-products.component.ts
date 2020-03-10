import { DisponibilityService } from './../../../../shared/services/managers/disponibility.service';
import { ProductService } from './../../../../shared/services/managers/product.service';
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
import { ProviderService } from 'src/app/shared/services/managers/provider.service';

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
    private router: Router,
    private providerService: ProviderService,
    private productService: ProductService,
    private disponibilityService: DisponibilityService) {
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
   if (e.value) {
    return '$' + e.value;
   }
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
    await this.disponibilityService
      .Update(model)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowInserted(e) {
    const model = this.createObjectConfiguration(e, false);
    await this.disponibilityService
      .Insert(model)
      .then(response => {

      })
      .catch(error => {
        console.error(error);
      });

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
      await this.disponibilityService
        .Delete(settingsId)
        .then(response => {

        })
        .catch(error => {
          console.error(error);
        });

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
      IDProvider: e.data.IDProvider.ID,
      IDProduct: e.data.IDProduct.ID,
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
      IDProvider = e.data.IDProvider ? e.data.IDProvider.ID : null;
      IDProduct = e.data.IDProduct ? e.data.IDProduct.ID : null;

    } else {
      ID = e.oldData.ID;
      IDProvider = e.newData.IDProvider
        ? e.newData.IDProvider.ID
        : e.oldData.IDProvider.ID;
      IDProduct = e.newData.IDProduct
        ? e.newData.IDProduct.ID
        : e.oldData.IDProduct.ID;
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
        item.IDProvider.ID === IDProvider &&
        item.IDProduct.ID === IDProduct);
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
    await this.loadSuppliers();
    await this.loadProducts();
    await this.getData();
  }

  onValueChanged(e) {
  }

  async getData() {
    await this.disponibilityService
      .GetAll()
      .then(response => {
        this.data = response;
      })
      .catch(error => {
        console.error(error);
      });
  }



  onEditorPreparing(e) {
  }

  onEditorPrepared(e) {
  }


  async loadProducts() {
    await this.productService
      .GetAll()
      .then(response => {
        this.lstProducts = response;
      })
      .catch(error => {
        console.error(error);
      });

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
    await this.providerService
      .GetAll()
      .then(response => {
        this.lstSupplier = response;
      })
      .catch(error => {
        console.error(error);
      });

  }




  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }
}
