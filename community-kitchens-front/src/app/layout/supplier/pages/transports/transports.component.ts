import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DxDataGridComponent, DxLookupComponent } from 'devextreme-angular';

import { Router } from '@angular/router';
// Lenguaje
import { locale, loadMessages } from 'devextreme/localization';
import * as esMessages from 'devextreme/localization/messages/es.json';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TypeUnitMeasureEnum, TypePreservationEnum } from 'src/app/shared/util/enum';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss']
})
export class TransportsComponent implements OnInit {

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
  public lstSupplier = [];
  public Viewdisabled = true;
  public lstPreservation = [];
  public lstUnitMeasure = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router) {
    this.refreshMode = 'reshape';
    this.translate.get('Transport').subscribe((res: string) => {
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
      Code: e.data.Code,
      CarPlate: e.data.CarPlate,
      Brand: e.data.Brand,
      Year: e.data.Year,
      TransportType: e.data.TransportType,
      PersonInCharge: e.data.PersonInCharge,
      PhonePersonInCharge: e.data.PhonePersonInCharge,
      MailPersonInCharge: e.data.MailPersonInCharge,
      PaymentUnity: e.data.PaymentUnity,
      PaymentMeasurement: e.data.PaymentMeasurement,
      PaymentValue: e.data.PaymentValue,
      Availability: e.data.Availability,
    };
    return model;

  }

  valRowCell(e): boolean {
    let ID: any;
    let Code: any;
    let CarPlate: any;
    let boolState = true;

    if (e.data) {
      Code = e.data.Code ? e.data.Code : null;
      CarPlate = e.data.CarPlate ? e.data.CarPlate : null;

    } else {
      ID = e.oldData.ID;
      Code = e.newData.Code
        ? e.newData.Code
        : e.oldData.Code;
        CarPlate = e.newData.CarPlate
        ? e.newData.CarPlate
        : e.oldData.CarPlate;
    }
    if (
      this.valRowGrid(
        ID,
        Code,
        CarPlate
      )
    ) {
      boolState = false;
    }
    return boolState;
  }

  valRowGrid(
    ID,
    Code,
    CarPlate): boolean {
    const grid: any = this.gridConfig.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.Code === Code &&
        item.CarPlate === CarPlate);
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
    this.loadEnumPreservation();
    this.loadEnumUnitMeasure();
    await this.loadSuppliers();
    await this.getData();
  }
   onValueChanged(e) {
   }

  async getData() {

    this.data = [
      {
        ID: 1,
        IDProvider: 12,
        Code: 'TRANS1',
        CarPlate: 'UGR48D',
        Brand: 'AKT',
        Year: 2015,
        TransportType: 0,
        PersonInCharge: 'PRUEBA1',
        PhonePersonInCharge: 3043375088,
        MailPersonInCharge: '1111@1111.com',
        PaymentUnity: 1,
        PaymentMeasurement: 9,
        PaymentValue: 5000,
        Availability: 1
      },
    {
        ID: 2,
        IDProvider: 13,
        Code: 'TRANS2',
        CarPlate: 'UGR49D',
        Brand: 'AKT',
        Year: 2016,
        TransportType: 1,
        PersonInCharge: 'PRUEBA1',
        PhonePersonInCharge: 3043375088,
        MailPersonInCharge: '1111@1111.com',
        PaymentUnity: 1,
        PaymentMeasurement: 10,
        PaymentValue: 5000,
        Availability: 0
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



  onEditorPreparing(e) {
  }

  onEditorPrepared(e) {
  }



  async loadEnumPreservation() {
    const enumT = TypePreservationEnum;
    const opts: string[] = Object.keys(enumT);
    const excludeid: any[] = [];
    for (const itemEnum in enumT) {
      if (enumT.hasOwnProperty(itemEnum) && isNaN(Number(itemEnum)) === false) {
        const objEnumValue = {
          code: Number(itemEnum),
          name: this.translate.instant(enumT[itemEnum])
        };
        this.lstPreservation.push(objEnumValue);
      }
    }
  }

  customizeText(e) {
    return '$' + e.value;
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

}
