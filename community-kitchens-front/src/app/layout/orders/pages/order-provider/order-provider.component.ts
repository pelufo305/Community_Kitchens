import { TransportService } from './../../../../shared/services/managers/transport.service';
import { ProviderService } from 'src/app/shared/services/managers/provider.service';
import { RecipeService } from 'src/app/shared/services/managers/recipe.service';
import { IngredientService } from 'src/app/shared/services/managers/ingredient.service';
import { ProductService } from 'src/app/shared/services/managers/product.service';
import { DisponibilityService } from 'src/app/shared/services/managers/disponibility.service';
import { DinnersService } from 'src/app/shared/services/managers/dinners.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material';
import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  TemplateRef
} from '@angular/core';
import { DxDataGridComponent, DxLookupComponent } from 'devextreme-angular';
// Lenguaje
import { locale, loadMessages } from 'devextreme/localization';
import * as esMessages from 'devextreme/localization/messages/es.json';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TypePreservationEnum, TypeUnitMeasureEnum, TypeSupplierEnum } from 'src/app/shared/util/enum';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PreOrderService } from 'src/app/shared/services/managers/pre-order.service';
import { OrderService } from 'src/app/shared/services/managers/order.service';



@Component({
  selector: 'app-order-provider',
  templateUrl: './order-provider.component.html',
  styleUrls: ['./order-provider.component.scss']
})
export class OrderProviderComponent implements OnInit {

  @ViewChild('content') templateRef: TemplateRef<any>;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
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
  public dataProcess = [];
  public dataHistoric = [];
  public dataDate = [];
  public Message: any;
  public MessageNot: any;
  public MessageNotField: any;
  public Title: any;
  public lstTransport = [];
  public lstSupplier = [];
  public selectedIndex = 0;
  public closeResult = '';
  public strComedor = '';
  public strDateOrder = '';
  public TotalCost = 0;
  private IDPreOrder = 0;
  private MessagSend: string;
  private MessagDelte: string;
  private boolProcess = true;
  private ProcessActive: string;
  private IDprovider;
  public TypeSupplier;

  @ViewChild('gridConfigOrder') gridConfigOrder: DxDataGridComponent;
  @ViewChild('gridConProcess') gridConProcess: DxDataGridComponent;
  constructor(public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private change: ChangeDetectorRef,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private disponibilityService: DisponibilityService,
    private productService: ProductService,
    private dinnersService: DinnersService,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private transportService: TransportService,
    private orderService: OrderService,
    private preOrderService: PreOrderService,
    private confirmationDialogService: ConfirmationDialogService) {
    this.refreshMode = 'reshape';

    if (
      this.translate.currentLang === 'es'
    ) {
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

    this.translate.get('ResponseSend').subscribe((res: string) => {
      this.MessagSend = res;
    });
    this.AceptClick = this.AceptClick.bind(this);
    this.RejectClick = this.RejectClick.bind(this);
  }

  ngOnInit() {
    this.loadCatalog();
  }

  sumCost(lst) {
    return lst.reduce((prev, cur) => prev + cur.Cost, 0);
  }
  sumCostTransport(lst) {
    return lst.reduce((prev, cur) => prev + cur.CostTransport, 0);
  }
  sumQuantity(lst) {
    return lst.reduce((prev, cur) => prev + cur.Quantity, 0);
  }
  sumUnitValue(lst) {
    return lst.reduce((prev, cur) => prev + cur.UnitValue, 0);
  }


  async loadCatalog() {
    await this.getDataRoom();
    await this.getDataRecipesAll();
    await this.loadEnumUnitMeasure();
    this.IDprovider = localStorage.getItem('IDProvider');
    this.TypeSupplier = localStorage.getItem('TypeSupplier');
    if (this.TypeSupplier === TypeSupplierEnum.Transport.toString()) {
      await this.getDataDateTransport(this.IDprovider);
    } else {
      await this.getDataDate(this.IDprovider);
    }

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

  async getDataDate(ID) {
    await this.orderService
      .GetOrderItemByProvider(ID, this.getDateActual())
      .then(response => {
        this.dataDate = response;
      })
      .catch(error => {
        console.error(error);
      });
  }


  async getDataDateTransport(ID) {
    await this.orderService
      .GetOrderItemByTransport(ID, this.getDateActual())
      .then(response => {
        this.dataDate = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async AceptClick(e) {
    this.IDPreOrder = e.row.data.ID;
    const model = this.createObject(this.IDprovider, this.IDPreOrder, true);
    if (this.TypeSupplier === TypeSupplierEnum.Transport.toString()) {
      await this.ResponseTransport(model);
      await this.getDataDateTransport(this.IDprovider);
    } else {
      await this.ResponseProvider(model);
      await this.getDataDate(this.IDprovider);
    }

  }

  async RejectClick(e) {
    this.IDPreOrder = e.row.data.ID;
    const model = this.createObject(this.IDprovider, this.IDPreOrder, false);
    if (this.TypeSupplier === TypeSupplierEnum.Transport.toString()) {
      await this.ResponseTransport(model);
      await this.getDataDateTransport(this.IDprovider);
    } else {
      await this.ResponseProvider(model);
      await this.getDataDate(this.IDprovider);
    }
  }


  createObject(ID, IDPreorder, Response) {
    const model = {
      ID: ID,
      IDPreOrden: IDPreorder,
      Response: Response
    };
    return model;
  }


  customizeText(e) {
    return e.value;
  }

  getDateActual(): string {
    const today = new Date();
    const dd = today.getDate();
    let strdd = dd.toString();
    const mm = today.getMonth() + 1;
    let strmm = mm.toString();
    const yyyy = today.getFullYear();
    if (dd < 10) {
      strdd = '0' + dd.toString();
    }

    if (mm < 10) {
      strmm = '0' + mm.toString();
    }
    return yyyy + '-' + strmm + '-' + strdd;

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


  assingUnit(code) {
    const found = this.lstUnitMeasure.find(element => element.code === code).name;
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
  totalConcatenate(val) {
    return val.CostTransport + val.Cost;
  }

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }



  async ResponseProvider(data) {
    await this.orderService
      .ResponseProvider(data)
      .then(response => {
        this.toastr.success(this.MessagSend);
      })
      .catch(error => {
        console.error(error);
      });

  }

  async ResponseTransport(data) {
    await this.orderService
      .ResponseTransport(data)
      .then(response => {
        this.toastr.success(this.MessagSend);
      })
      .catch(error => {
        console.error(error);
      });

  }

}








