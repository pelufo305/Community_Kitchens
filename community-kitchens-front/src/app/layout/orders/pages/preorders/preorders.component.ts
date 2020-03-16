import { RecipeService } from 'src/app/shared/services/managers/recipe.service';
import { IngredientService } from 'src/app/shared/services/managers/ingredient.service';
import { ProductService } from 'src/app/shared/services/managers/product.service';
import { DisponibilityService } from 'src/app/shared/services/managers/disponibility.service';
import { DinnersService } from 'src/app/shared/services/managers/dinners.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { DxDataGridComponent, DxLookupComponent } from 'devextreme-angular';
// Lenguaje
import { locale, loadMessages } from 'devextreme/localization';
import * as esMessages from 'devextreme/localization/messages/es.json';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TypePreservationEnum, TypeUnitMeasureEnum } from 'src/app/shared/util/enum';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';


@Component({
  selector: 'app-preorders',
  templateUrl: './preorders.component.html',
  styleUrls: ['./preorders.component.scss']
})
export class PreordersComponent implements OnInit {
  public lstRoom = [];
  public lsRecipe = [];
  public lstIngredient = [];
  public selectRoom: any;
  public lstUnitMeasure = [];
  public selectRecipe: any ;
  public textFilterReset;
  public textSaveRow;
  public textCancelRow;
  public textCancelAllRow;
  public textEditRow;
  public textDeleteRow;
  public textDeleteConfirm;
  public refreshMode: any;
  public nameFiltersRow = {};
  constructor(public translate: TranslateService,
              private router: Router,
              private recipeService: RecipeService,
              private ingredientService: IngredientService,
              private disponibilityService: DisponibilityService,
              private productService: ProductService,
              private dinnersService: DinnersService) {
                this.refreshMode = 'reshape';

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

  ngOnInit() {
    this.loadCatalog();
  }

  onValueRoom(e) {
    console.log(e);
  }

  onValueRecipe(e) {
    console.log(e);
  }

 async loadCatalog() {
  await this.getDataRoom();
  await this.getDataRecipes();
 }


  async getDataRoom() {
    await this.dinnersService
      .GetAll()
      .then(response => {
        this.lstRoom = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async getDataRecipes() {
    await this.recipeService
      .GetAll()
      .then(response => {
        this.lsRecipe = response;
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

  getIngredient(recipesID: number) {
    const lst = this.lstIngredient.filter(recipe => recipe.IDRecipe.ID === recipesID);
    const lstingredients = lst.map(obj => {
      const rObj = {
        ID: obj.IDProduct.ID,
        Code: obj.IDProduct.Code,
        Name: obj.IDProduct.Name,
        MeasurementUnit: obj.IDProduct.MeasurementUnit,
        Quantity: obj.Quantity
      };
      return rObj;
    });
    return lstingredients;
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
