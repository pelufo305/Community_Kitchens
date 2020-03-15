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
  public selectRoom: any;
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
  }

  onValueRecipe(e) {
  }

 async loadCatalog() {
  await this.getDataRoom();
  await this.getDataRecipes();
 }


  async getDataRoom() {
    await this.dinnersService
      .GetAll()
      .then(response => {
        this.selectRoom = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async getDataRecipes() {
    await this.recipeService
      .GetAll()
      .then(response => {
        this.selectRecipe = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

}
