import { ProductService } from 'src/app/shared/services/managers/product.service';
import { IngredientService } from './../../../../shared/services/managers/ingredient.service';
import { RecipeService } from './../../../../shared/services/managers/recipe.service';
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
  public lstProducts = [];
  public lstUnitMeasure = [];
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private productService: ProductService) {
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
    this.getFilterProducts = this.getFilterProducts.bind(this);

  }

  /*Ingredientes*/

  onInitNewRowIngredients(e) {
    this.isAllowDeleting = false;
    let maxid = 0;
    const grid: any = this.gridConfigIng.dataSource;
    grid.map(function (obj) {
      if (obj.Id > maxid) {
        maxid = obj.Id;
      }
    });
    e.data.Id = maxid + 1;

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
    await this.ingredientService
      .Update(model)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowInsertedIngredients(e) {
    const model = this.createObjectIngredients(e, false);
    await this.ingredientService
      .Insert(model)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowRemovedIngredients(e) {
    const settingsId = e.data.Id;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {
      await this.ingredientService
        .Delete(settingsId)
        .then(response => {
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  valRowCellIngredients(e): boolean {
    let ID: any;
    let IDProduct: any;
    let IDRecipe: any;
    let boolState = true;


    if (e.data) {
      IDProduct = e.data.IDProduct ? e.data.IDProduct.ID : null;
      IDRecipe = e.data.IDRecipe ? e.data.IDRecipe.ID : null;

    } else {
      ID = e.oldData.Id;
      IDProduct = e.newData.IDProduct
        ? e.newData.IDProduct.ID
        : e.oldData.IDProduct.ID;
      IDRecipe = e.newData.IDRecipe
        ? e.newData.IDRecipe.ID
        : e.oldData.IDRecipe.ID;
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
        item.Id !== ID &&
        item.IDProduct.ID === IDProduct &&
        item.IDRecipe.ID === IDRecipe);
    if (gridValidate.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  createObjectIngredients(e, updated: boolean): any {
    const model = {
      Id: updated ? e.data.Id : -1,
      IDRecipe: e.data.IDRecipe.ID,
      IDProduct: e.data.IDProduct.ID,
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
    await this.recipeService
      .Update(model)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowInserted(e) {
    const model = this.createObjectConfiguration(e, false);
    await this.recipeService
      .Insert(model)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowRemoved(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {
      await this.recipeService
        .Delete(settingsId)
        .then(response => {
        })
        .catch(error => {
          console.error(error);
        });

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
    await this.loadProducts();
    await this.getDataIngredients();
    await this.getData();
  }
  onValueChanged(e) {
  }


  getFilterProducts() {
    return {
      store: this.lstProducts,
      paginate: true,
      loadMode: 'raw'
    };
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

  async getDataIngredients() {
    await this.ingredientService
      .GetAll()
      .then(response => {
        this.lstIngredient = response;
      })
      .catch(error => {
        console.error(error);
      });
  }


  async getData() {
    await this.recipeService
      .GetAll()
      .then(response => {
        this.data = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  getIngredient(recipesID: number) {
    const lst = this.lstIngredient.filter(recipe => recipe.IDRecipe.ID === recipesID);
    const lstingredients = lst.map(obj => {
      const rObj = {
        Code: obj.IDProduct.Code,
        Name: obj.IDProduct.Name,
        MeasurementUnit: this.lstUnitMeasure.filter(objs => objs.code === obj.IDProduct.MeasurementUnit)[0].name,
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
