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
  constructor(public translate: TranslateService,
              private router: Router,
              private recipeService: RecipeService,
              private ingredientService: IngredientService,
              private disponibilityService: DisponibilityService,
              private productService: ProductService,
              private dinnersService: DinnersService) { }

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
        MeasurementUnit: this.lstUnitMeasure.filter(objs => objs.code === obj.IDProduct.MeasurementUnit)[0].name,
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
