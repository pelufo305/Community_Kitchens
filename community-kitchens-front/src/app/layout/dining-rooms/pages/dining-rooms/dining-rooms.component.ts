
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
import { DinnersService } from 'src/app/shared/services/managers/dinners.service';

@Component({
  selector: 'app-dining-rooms',
  templateUrl: './dining-rooms.component.html',
  styleUrls: ['./dining-rooms.component.scss']
})
export class DiningRoomsComponent implements OnInit {
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
  public lstCity = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private dinnersService: DinnersService) {
    this.refreshMode = 'reshape';
    this.translate.get('DiningRooms').subscribe((res: string) => {
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
    await this.dinnersService
      .Update(model)
      .then(response => {

      })
      .catch(error => {
        console.error(error);
      });
  }

  async onRowInserted(e) {
    const model = this.createObjectConfiguration(e, false);
    console.log(model);
    await this.dinnersService
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


  async onRowRemoved(e) {
    const settingsId = e.data.ID;
    const messages = {
      success: 'Msg10',
      error: 'Error1'
    };
    if (settingsId > 0) {
      await this.dinnersService
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
      Code: e.data.Code,
      Name: e.data.Name,
      Address: e.data.Address,
      Phone: e.data.Phone,
      Email: e.data.Email,
      Contact: e.data.Contact,
      ContactEmail: e.data.ContactEmail,
      ContactPhone: e.data.ContactPhone,
      ChildNumber: e.data.ChildNumber,
      ScheduleReception: e.data.ScheduleReception,
      City: e.data.City,
      Neiborhood: e.data.Neiborhood
    };
    return model;
  }

  valRowCell(e): boolean {
    let ID: any;
    let Code: any;
    let boolState = true;

    if (e.data) {
      Code = e.data.Code ? e.data.Code : null;

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
    this.loadCatalog();
  }

  async loadCatalog() {
    await this.getData();
  }

  getDataCity() {
    return {
      store: [{ id: 1, name: 'Bogota' }],
      paginate: true,
      loadMode: 'raw'
    };
  }

  setStateValueCountry(rowData: any, value: any): void {
    rowData.Neighborhood = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  async getData() {
    await this.dinnersService
      .GetAll()
      .then(response => {
        this.data = response;
      })
      .catch(error => {
        console.error(error);
      });
  }

  onEditorPreparing(e) {
  }

  onEditorPrepared(e) {
  }

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }

}
