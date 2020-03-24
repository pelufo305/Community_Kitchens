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
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { PreOrderService } from 'src/app/shared/services/managers/pre-order.service';


@Component({
  selector: 'app-preorders',
  templateUrl: './preorders.component.html',
  styleUrls: ['./preorders.component.scss']
})
export class PreordersComponent implements OnInit {
  public lstRoom = [];
  public selectedRowKeysGrid = [];
  public lsRecipe = [];
  public lsRecipeAll = [];
  public lstIngredient = [];
  public lstProducts = [];
  public lstSelectedProducts = [];
  public selectRoom: any;
  public lstUnitMeasure = [];
  public selectRecipe: any;
  public textFilterReset;
  public textSaveRow;
  public textCancelRow;
  public textCancelAllRow;
  public textEditRow;
  public textDeleteRow;
  public textDeleteConfirm;
  public refreshMode: any;
  public nameFiltersRow = {};
  public data = [];
  public dataHistoric = [];
  public Message: any;
  public MessageNot: any;
  public MessageNotField: any;
  public Title: any;
  private IDDiningRoom = 0;
  private IDRecipe = 0;
  private MessagSend: any;

  @ViewChild('gridConfigIng') gridConfigIng: DxDataGridComponent;
  @ViewChild('gridConfigproduct') gridConfigproduct: DxDataGridComponent;
  constructor(public translate: TranslateService,
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private disponibilityService: DisponibilityService,
    private productService: ProductService,
    private dinnersService: DinnersService,
    private toastr: ToastrService,
    private preOrderService: PreOrderService,
    private confirmationDialogService: ConfirmationDialogService) {
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
    this.translate.get('SendPreOrder').subscribe((res: string) => {
      this.Title = res;
    });
    this.translate.get('MessagePreOrder').subscribe((res: string) => {
      this.Message = res;
    });

    this.translate.get('MessageNotPreorder').subscribe((res: string) => {
      this.MessageNot = res;
    });

    this.translate.get('MessageNotField').subscribe((res: string) => {
      this.MessageNotField = res;
    });
    this.translate.get('MessageSend').subscribe((res: string) => {
      this.MessagSend = res;
    });

  }

  ngOnInit() {
    this.loadCatalog();
  }

  async onValueRoom(e) {
    if (e.selectedItem) {
      if (e.selectedItem.ID) {
        this.IDDiningRoom = e.selectedItem.ID;
        await this.getDataHistoric(this.IDDiningRoom);
      }
    }
  }

  async onValueRecipe(e) {
    if (e.selectedItem) {
      if (e.selectedItem.ID) {
        this.IDRecipe = e.selectedItem.ID;
        this.getIngredient(this.IDRecipe);
        await this.loadProducts();
      }

    }
  }

  validateFields(): boolean {
    if (this.IDRecipe === 0) {
      return false;
    }
    if (this.IDDiningRoom === 0) {
      return false;
    }
    return true;
  }

  async loadCatalog() {
    await this.loadEnumUnitMeasure();
    await this.getDataRoom();
    await this.getDataRecipes();
    await this.getDataRecipesAll();
    await this.getDataIngredients();
  }


  onClick(e) {

    if (this.validateFields()) {
      this.confirmationDialogService.confirm(this.Title, this.Message)
        .then((confirmed) => {
          if (confirmed) {

            const lstSelected = this.gridConfigproduct.instance.getSelectedRowsData();
            const lstNotSelected = this.gridConfigproduct.instance.getSelectedRowsData().
              filter(data => data.Quantity === 0 || data.Quantity === undefined);

            if (lstSelected.length > 0 && lstNotSelected.length > 0) {
              this.toastr.error(this.MessageNot);
            } else {
              this.processPreOrder();
            }

          }
        })
        .catch(() => console.log('error'));
    } else {
      this.toastr.error(this.MessageNotField);
    }


  }

  onRowUpdating(e) {
    const Quantity = e.newData.Quantity;
    if (Quantity <= 0) {
      e.cancel = true;
      e.isValid = false;
      this.toastr.error(this.MessageNot);
    }
  }

  onSelectionChanged(e) {

  }

  async processPreOrder() {
    this.lstSelectedProducts = [];
    this.createListProduct();
    const model = this.createObject();
    await this.preOrderService
      .Insert(model)
      .then(response => {
        this.getDataHistoric(model.IDDiningRoom);
        this.toastr.success(this.MessagSend);
      })
      .catch(error => {
        console.error(error);
      });

  }


  createListProduct() {
    const lstIngredents: any = this.gridConfigIng.dataSource;
    const lstProducts: any = this.gridConfigproduct.instance.getSelectedRowsData();
    lstIngredents.forEach(object => {
      this.lstSelectedProducts.push(object);
    });
    lstProducts.forEach(object => {
      this.lstSelectedProducts.push(object);
    });

  }
  createObject() {
    const model = {
      IDDiningRoom: this.IDDiningRoom,
      IDRecipe: this.IDRecipe,
      IDProduct: this.lstSelectedProducts
    };
    return model;
  }


  async loadProducts() {
    await this.productService
      .GetRecomendedProducts()
      .then(response => {
        this.lstProducts = response;
      })
      .catch(error => {
        console.error(error);
      });

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


  async getDataHistoric(IDDiningRoom) {
    await this.preOrderService
      .GetPreorderByDinningRoom(IDDiningRoom)
      .then(response => {
        this.dataHistoric = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async getDataRecipes() {
    await this.recipeService
      .GetRecomendedRecipes()
      .then(response => {
        this.lsRecipe = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async getDataRecipesAll() {
    await this.recipeService
      .GetAll()
      .then(response => {
        this.lsRecipeAll = response;
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
        Preservation: obj.IDProduct.Preservation,
        MeasurementUnit: obj.IDProduct.MeasurementUnit,
        Quantity: obj.Quantity
      };
      return rObj;
    });
    this.data = lstingredients;
  }


 assingUnit(code) {
  const found = this.lstUnitMeasure.find(element => element.code == code).name;
  return found;
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

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }

}
