import { ProviderService } from './../../../../../shared/services/managers/provider.service';
import { UserService } from './../../../../../shared/services/managers/user.service';
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
  public dataProvider = [];
  public Viewdisabled = true;
  public lstUserType = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private userService: UserService,
    private providerService: ProviderService) {
    this.refreshMode = 'reshape';
    this.translate.get('Users').subscribe((res: string) => {
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
    this.getDataProvider = this.getDataProvider.bind(this);
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
    await this.userService
      .Update(model)
      .then(response => {

      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowInserted(e) {
    const model = this.createObjectConfiguration(e, false);
    await this.userService
      .Insert(model)
      .then(response => {

      })
      .catch(error => {
        console.error(error);
      });
  }

  async onKeyDown(e) {
    if (e.event.key === 'Escape') {
      this.isAllowDeleting = true;
    }
  }

  getDataProvider() {
    return {
      store: this.dataProvider,
      paginate: true,
      loadMode: 'raw'
    };
  }

  async onRowRemoved(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {
      await this.userService
        .Delete(settingsId)
        .then(response => {

        })
        .catch(error => {
          console.error(error);
        });

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
      Username: e.data.Username,
      Name: e.data.Name,
      LastName: e.data.LastName,
      Password: e.data.Password,
      UserType: e.data.UserType,
      ProviderID: e.data.ProviderID
    };
    return model;

  }

  valRowCell(e): boolean {
    let ID: any;
    let UserName: any;
    let boolState = true;

    if (e.data) {
      UserName = e.data.Username ? e.data.Username : null;

    } else {
      ID = e.oldData.ID;
      UserName = e.newData.Username
        ? e.newData.Username
        : e.oldData.Username;
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
    Username): boolean {
    const grid: any = this.gridConfig.dataSource;
    const gridValidate = grid.filter(
      item =>
        item.ID !== ID &&
        item.Username === Username);
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
    await this.getProvider();
    await this.getData();
  }
  onValueChanged(e) {
  }

  async getProvider() {
    await this.providerService
      .GetAll()
      .then(response => {
        this.dataProvider = response;
      })
      .catch(error => {
        console.error(error);
      });
  }
  async getData() {
  await this.userService
      .GetAll().then(response => {
      const reformattedArray = response.map(function(obj){
          const rObj = {};
          rObj['ID'] = obj.ID;
          rObj['Username'] = obj.Username;
          rObj['Name'] = obj.Name;
          rObj['LastName'] = obj.LastName;
          rObj['Password'] = obj.Password;
          rObj['UserType'] = obj.UserType;
          rObj['ProviderID'] = obj.Provider ? obj.Provider.ID : null;
           return rObj;
       });
         this.data = reformattedArray;
      })
      .catch(error => {
        console.error(error);
      });
  }

  onEditorPreparing(e) {
    if (e.parentType === 'dataRow' && e.dataField === 'Password') {
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
