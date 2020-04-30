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
import { TypePreservationEnum, TypeUnitMeasureEnum } from 'src/app/shared/util/enum';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PreOrderService } from 'src/app/shared/services/managers/pre-order.service';
import { OrderService } from 'src/app/shared/services/managers/order.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
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
  public ReprocessMessage;
  public AcceptedMessage;
  public FinalyMessage;
  public AcceptedMessageNot;

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
    this.loadMessage();

    this.loadProducts();
    this.loadSuppliers();
    this.loadTransport();


    this.detailsBtnClick = this.detailsBtnClick.bind(this);
    this.getFilterProducts = this.getFilterProducts.bind(this);
    this.getFilterSuppliers = this.getFilterSuppliers.bind(this);
    this.getFilterTransport = this.getFilterTransport.bind(this);

  }

  ngOnInit() {
    this.loadCatalog();
  }

  loadMessage() {
    this.translate.get('MessageSend').subscribe((res: string) => {
      this.MessagSend = res;
    });
    this.translate.get('DeeleteProcess').subscribe((res: string) => {
      this.MessagDelte = res;
    });
    this.translate.get('ProcessActive').subscribe((res: string) => {
      this.ProcessActive = res;
    });
    this.translate.get('Order').subscribe((res: string) => {
      this.Title = res;
    });
    this.translate.get('OrderMessage').subscribe((res: string) => {
      this.Message = res;
    });

    this.translate.get('OrderMessageNot').subscribe((res: string) => {
      this.MessageNot = res;
    });


    this.translate.get('ReprocessMessage').subscribe((res: string) => {
      this.ReprocessMessage = res;
    });

    this.translate.get('AcceptedMessage').subscribe((res: string) => {
      this.AcceptedMessage = res;
    });

    this.translate.get('FinalyMessage').subscribe((res: string) => {
      this.FinalyMessage = res;
    });

    this.translate.get('AcceptedMessageNot').subscribe((res: string) => {
      this.AcceptedMessageNot = res;
    });
  }

  async loadCatalog() {
    await this.getDataRoom();
    await this.getDataRecipesAll();
    await this.loadEnumUnitMeasure();
    await this.getDataDate();

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
  async onTabChanged(e) {
    if (e.index === 0) {
      this.dataProcess = [];
      this.strComedor = '';
      this.strDateOrder = '';
      this.TotalCost = 0;
      await this.getDataDate();
    }
    this.selectedIndex = e.index;
  }

  async getDataHistoric() {
    await this.preOrderService
      .GetAll()
      .then(response => {
        this.dataHistoric = response;
      })
      .catch(error => {
        console.error(error);
      });
  }
  async getDataDate() {
    await this.preOrderService
      .GetByDate(this.getDateActual())
      .then(response => {
        this.dataDate = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async detailsBtnClick(e) {

    this.IDPreOrder = e.row.data.ID;
    this.selectedIndex = 1;
    this.strComedor = this.lstRoom.find(element => element.ID === e.row.data.IDDiningRoom).Name;
    this.strDateOrder = e.row.data.PreOrderDate;
    await this.loadProcessOrder(this.IDPreOrder);
    if (this.dataProcess.length === 0) {
      await this.loadProcess(this.IDPreOrder);
      this.boolProcess = false;
    }

  }

  async onClickSend(e) {
    if (this.boolProcess) {
      this.toastr.error(this.ProcessActive);
    } else {
      const data: any = this.gridConProcess.dataSource;
      const dataModel = data.map(obj => {
        return {
          ID: obj.ID,
          IDProduct: obj.IDProduct,
          IDProvider: obj.IDProvider,
          IDPreOrder: this.IDPreOrder,
          Quantity: obj.Quantity,
          UnitValue: obj.UnitValue,
          ExpirationDays: obj.ExpirationDays,
          Cost: obj.Cost,
          DurationText: obj.DurationText,
          DistanceText: obj.DistanceText,
          IDTransport: obj.IDTransport,
          CostTransport: obj.CostTransport,
          AcceptedProvider: obj.AcceptedProvider,
          AcceptedTransport: obj.AcceptedTransport,

        };
      });

      await this.confirmationDialogService.confirm(this.Title, this.Message)
        .then((confirmed) => {
          if (confirmed) {
            this.ProceesInsert(dataModel);
            this.boolProcess = true;
          }
        })
        .catch(() => console.log('error'));
    }
  }

  async onClickReject(e) {

    await this.confirmationDialogService.confirm(this.Title, this.MessageNot)
      .then((confirmed) => {
        if (confirmed) {
          this.DelteProcess(this.IDPreOrder);
          this.boolProcess = false;
          this.dataProcess = [];
         }
      })
      .catch(() => console.log('error'));

  }

  async loadProcess(Id: any) {
    await this.orderService
      .ProcessOrder(Id)
      .then(response => {
        this.TotalCost = response.TotalCost;
        this.dataProcess = response.DisponibilityProcesses;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async ProcessOrderRejected(Id: any) {
    await this.orderService
      .ProcessOrderRejected(Id)
      .then(response => {
        this.TotalCost = response.TotalCost;
        this.dataProcess = response.DisponibilityProcesses;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async ProcessOrderRejectedTransport(Id: any) {
    await this.orderService
      .ProcessOrderRejectedTransport(Id)
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  }

  async Accepted(Id: any) {
    await this.orderService
      .Accepted(Id)
      .then(response => {
        this.toastr.success(this.FinalyMessage);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async DelteProcess(Id: any) {
    await this.orderService
      .Delete(Id)
      .then(response => {
        this.toastr.success(this.MessagDelte);
      })
      .catch(error => {
        console.error(error);
      });
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
  ObserverConcatenate(val) {
    let resultPro = '';
    let resultTra = '';
    switch (val.AcceptedProvider) {
      case false:
        resultPro = 'Proveedor ha rechazado';
        break;
      case true:
        resultPro = 'Proveedor  confirmardo';
        break;
      default:
        resultPro = 'Proveedor sin confirmar';
    }
    switch (val.AcceptedTransport) {
      case false:
        resultTra = 'Transporte ha rechazado';
        break;
      case true:
        resultTra = 'Transporte  confirmardo';
        break;
      default:
        resultTra = 'Transporte sin confirmar';
    }

    const res = `\n ${resultPro}. \n ${resultTra}`;
    return res;
  }
  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
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

  async loadProcessOrder(ID) {
    await this.orderService
      .ProcessPreOrder(ID)
      .then(response => {
        this.dataProcess = response;
      })
      .catch(error => {
        console.error(error);
      });

  }


  async ProceesInsert(data) {
    await this.orderService
      .Insert(data)
      .then(response => {
        this.toastr.success(this.MessagSend);
      })
      .catch(error => {
        console.error(error);
      });

  }

  async loadTransport() {
    await this.transportService
      .GetAll()
      .then(response => {
        this.lstTransport = response;
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

  getFilterTransport() {
    return {
      store: this.lstTransport,
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
  async onClickReprocess(e) {
    await this.confirmationDialogService.confirm(this.Title, this.ReprocessMessage)
      .then((confirmed) => {
        if (confirmed) {
          this.ProcessOrderRejectedTransport(this.IDPreOrder);
          this.ProcessOrderRejected(this.IDPreOrder);
        }
      })
      .catch(() => console.log('error'));

  }

  async onClickAccepted(e) {
    await this.confirmationDialogService.confirm(this.Title, this.AcceptedMessage)
      .then((confirmed) => {
        if (confirmed) {

          const data: any = this.gridConProcess.dataSource;
          const result = data.every(function (e) {
            return e.AcceptedProvider === true && e.AcceptedTransport === true;
          });

          if (result === true) {
            this.Accepted(this.IDPreOrder);
            this.getDataDate();
          } else {
            this.toastr.error(this.AcceptedMessageNot);
          }

        }
      })
      .catch(() => console.log('error'));

  }


}
