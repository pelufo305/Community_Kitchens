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
import { TypePreservationEnum, TypeUnitMeasureEnum } from 'src/app/shared/util/enum';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  @ViewChild('gridConfig') gridConfig: DxDataGridComponent;
  @ViewChild('gridConfigIng') gridConfigIng: DxDataGridComponent;
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
  public lstIngredient = [];
  public excelTitle = '';
  public ingTitle = '';
  public lstUnitMeasure = [];
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router) {
    this.refreshMode = 'reshape';
    this.translate.get('Recipes').subscribe((res: string) => {
      this.excelTitle = res;
    });
    this.translate.get('Ingredients').subscribe((res: string) => {
      this.ingTitle = res;
    });
    if (
      this.translate.currentLang === 'es'
    ) {

      /*https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/MasterDetailView/Angular/Light/*/
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

  }

  /*Ingredientes*/

  onInitNewRowIngredients(e) {
    this.isAllowDeleting = false;
    let maxid = 0;
    const grid: any = this.gridConfigIng.dataSource;
    grid.map(function (obj) {
      if (obj.ID > maxid) {
        maxid = obj.ID;
      }
    });
    e.data.ID = maxid + 1;

  }

  onRowUpdatingIngredients(e) {
    if (!this.valRowCellIngredients(e)) {
      e.cancel = true;
      e.isValid = false;
    }
  }

  onRowInsertingIngredients(e) {
    this.isAllowDeleting = true;
    if (!this.valRowCellIngredients(e)) {
      e.cancel = true;
      e.isValid = false;
    }
  }

  async onRowUpdatedIngredients(e) {
    const model = this.createObjectIngredients(e, true);
    console.log(model);
  }

  async onRowInsertedIngredients(e) {
    const model = this.createObjectIngredients(e, false);
    console.log(model);
  }

  async onRowRemovedIngredients(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {

    }
  }

  valRowCellIngredients(e): boolean {
    let ID: any;
    let IDProduct: any;
    let IDRecipe: any;
    let boolState = true;


    if (e.data) {
      IDProduct = e.data.Product ? e.data.Product.ID : null;
      IDRecipe = e.data.IDRecipe ? e.data.IDRecipe : null;

    } else {
      ID = e.oldData.ID;
      IDProduct = e.newData.Product
        ? e.newData.Product.ID
        : e.oldData.Product.ID;
      IDRecipe = e.newData.IDRecipe
        ? e.newData.IDRecipe
        : e.oldData.IDRecipe;
    }
    if (
      this.valRowGridIngredients(
        ID,
        IDProduct,
        IDRecipe
      )
    ) {
      boolState = false;
    }
    return boolState;
  }

  valRowGridIngredients(
    ID,
    IDProduct,
    IDRecipe): boolean {
    const grid: any = this.gridConfigIng.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.Product.ID === IDProduct &&
        item.IDRecipe === IDRecipe);
    if (gridValidate.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  createObjectIngredients(e, updated: boolean): any {
    const model = {
      ID: updated ? e.data.ID : -1,
      IDRecipe: e.data.IDRecipe,
      IDProduct: e.data.Product.ID,
      Quantity: e.data.Quantity
    };
    return model;
  }
  /*Ingredientes*/

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

  async onRowRemoved(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {

    }
  }

  createObjectConfiguration(e, updated: boolean): any {
    const model = {
      ID: updated ? e.data.ID : -1,
      Code: e.data.Code,
      Name: e.data.Name,
    };
    return model;
  }

  async onKeyDown(e) {
    if (e.event.key === 'Escape') {
      this.isAllowDeleting = true;
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

  valRowCell(e): boolean {
    let ID: any;
    let Code: any;
    let boolState = true;

    if (e.data) {
      Code = e.data.AcAccount ? e.data.Code : null;

    } else {
      ID = e.oldData.ID;
      Code = e.newData.Code
        ? e.newData.Code
        : e.oldData.Code;
    }
    if (
      this.valRowGrid(
        ID,
        Code
      )
    ) {
      boolState = false;
    }
    return boolState;
  }

  valRowGrid(
    ID,
    Code): boolean {
    const grid: any = this.gridConfig.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.Code === Code);
    if (gridValidate.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.loadEnumUnitMeasure();
    this.loadCatalog();
  }

  async loadCatalog() {
    await this.getData();
  }
  onValueChanged(e) {
  }


  getDataProducts() {
    return {
      store: [{ ID: 1, Name: 'Mazorca-01', MeasurementUnit: 3 },
      { ID: 2, Name: 'Pollo-02', MeasurementUnit: 3 },
      { ID: 4, Name: 'Arroz-04', MeasurementUnit: 3 },
      { ID: 3, Name: 'Guascas-03', MeasurementUnit: 3 },
      { ID: 5, Name: 'Papa-06', MeasurementUnit:  0}],
      paginate: true,
      loadMode: 'raw'
    };
  }
  async getData() {
    this.lstIngredient = [
      { ID: 2, Product: { ID: 1, Name: 'Mazorca-01', MeasurementUnit: 3 }, IDRecipe: 1, Quantity: 5 },
      { ID: 3, Product: { ID: 2, Name: 'Pollo-02', MeasurementUnit: 3 }, IDRecipe: 1, Quantity: 7 },
      { ID: 4, Product: { ID: 3, Name: 'Guascas-03', MeasurementUnit: 3 }, IDRecipe: 1, Quantity: 9 },
      { ID: 5, Product: { ID: 1, Name: 'Mazorca-01', MeasurementUnit: 3 }, IDRecipe: 2, Quantity: 6 },
      { ID: 6, Product: { ID: 2, Name: 'Pollo-02', MeasurementUnit: 3 }, IDRecipe: 2, Quantity: 5 },
      { ID: 7, Product: { ID: 4, Name: 'Arroz-04', MeasurementUnit: 3 }, IDRecipe: 2, Quantity: 4 }];

    this.data = [{
      ID: 1,
      Code: '01',
      Name: 'Ajiaco1'
    },
    {
      ID: 2,
      Code: '02',
      Name: 'Ajiaco2'
    }
    ];

    /*
    let response
    if (response != null) {
      this.data = response;
      this.lstSetting = this.data;
    }
    */

  }
  getIngredient(recipesID: number) {
    const lst = this.lstIngredient.filter(recipe => recipe.IDRecipe === recipesID);
    const lstingredients = lst.map(obj => {
      const rObj = {
        Name: obj.Product.Name,
        MeasurementUnit: this.lstUnitMeasure.filter(objs => objs.code === obj.Product.MeasurementUnit)[0].name,
        Quantity: obj.Quantity
      };
      return rObj;
    });
    return lstingredients;
  }
  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }


  async loadEnumUnitMeasure() {
    const enumT = TypeUnitMeasureEnum;
    const opts: string[] = Object.keys(enumT);
    const excludeid: any[] = [];
    for (const itemEnum in enumT) {
      if (enumT.hasOwnProperty(itemEnum) && isNaN(Number(itemEnum)) === false) {
        const objEnumValue = {
          code: Number(itemEnum),
          name: this.translate.instant(enumT[itemEnum])
        };
        this.lstUnitMeasure.push(objEnumValue);
      }
    }
  }

}
