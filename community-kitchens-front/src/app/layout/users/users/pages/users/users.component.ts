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
import { TypePreservationEnum, TypeUnitMeasureEnum, TypeUserEnum } from 'src/app/shared/util/enum';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

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
  public lstUserType = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router) {
    this.refreshMode = 'reshape';
    this.translate.get('Products').subscribe((res: string) => {
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
      UserName: e.data.UserName,
      Name: e.data.Name,
      LastName: e.data.LastName,
      Password: e.data.Password,
      UserType: e.data.UserType
    };
    return model;

  }

  valRowCell(e): boolean {
    let ID: any;
    let UserName: any;
    let boolState = true;

    if (e.data) {
      UserName = e.data.UserName ? e.data.UserName : null;

    } else {
      ID = e.oldData.ID;
      UserName = e.newData.UserName
        ? e.newData.UserName
        : e.oldData.UserName;
    }
    if (
      this.valRowGrid(
        ID,
        UserName
      )
    ) {
      boolState = false;
    }
    return boolState;
  }

  valRowGrid(
    ID,
    UserName): boolean {
    const grid: any = this.gridConfig.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.UserName === UserName);
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
    this.loadEnumUserType();
    await this.getData();
  }
   onValueChanged(e) {
   }

  async getData() {

    this.data = [{
      ID: 1,
      UserName: '1111@1111.com',
      Name: 'Prueba',
      LastName: 'Prueba',
      Password: '1111',
      UserType: 0
    },
    {
      ID: 2,
      UserName: '2222@2222.com',
      Name: 'Prueba',
      LastName: 'Prueba',
      Password: '1111',
      UserType: 1
    },
    {
      ID: 3,
      UserName: '3333@3333.com',
      Name: 'Prueba',
      LastName: 'Prueba',
      Password: '1111',
      UserType: 2
    },


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
    if ( e.parentType === 'dataRow' && e.dataField === 'Password') {
      e.editorOptions.mode = 'password';
    }
  }

  customizeText(e) {
    return '*****';
  }


  onEditorPrepared(e) {
  }



  async loadEnumUserType() {
    const enumT = TypeUserEnum;
    const opts: string[] = Object.keys(enumT);
    const excludeid: any[] = [];
    for (const itemEnum in enumT) {
      if (enumT.hasOwnProperty(itemEnum) && isNaN(Number(itemEnum)) === false) {
        const objEnumValue = {
          code: Number(itemEnum),
          name: this.translate.instant(enumT[itemEnum])
        };
        this.lstUserType.push(objEnumValue);
      }
    }
  }

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }

}
