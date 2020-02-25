
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
  public lstItems = [];
  public lstSetting = [];
  public lstCountry = [];
  public lstState = [];
  public lstCity = [];
  public excelTitle = '';
  public isAllowDeleting = true;

  constructor(
    public translate: TranslateService,
    private router: Router) {
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


    this.getFilteredDepartment = this.getFilteredDepartment.bind(this);
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
    if (e.column.dataField === 'Department' && e.rowType === 'data') {
      const lst = locates.getStatesOfCountry(e.row.data.Country.toString());
      const reformattedlst = lst.map(function (obj) {
        const rObj = {};
        rObj[obj.id] = obj.name;
        return rObj;
      });
      e.column.lookup.valueExpr = 'id';
      e.column.lookup.displayExpr = 'name';
      e.column.lookup.dataSource = {
        store: lst,
        paginate: true,
        loadMode: 'raw'
      };
      e.column.lookup.items = lst;
      e.column.lookup.valueMap = { 47: 'Farah' };
      console.log(e.column.lookup.valueMap);
    }

  }
  // https://supportcenter.devexpress.com/Ticket/Details/T580399/dxdatagrid-bind-lookup-dynamically

  onRowPrepared(e) {
    /*if (e.rowType === 'data') {
     const row = e.columns[5].lookup;
     row.valueExpr='id'
     row.displayExpr='name'
     row.dataSource = {
        store: locates.getStatesOfCountry('2'),
        paginate: true,
        loadMode: 'raw'
      };
    }*/
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
      Department: e.data.Department,
      City: e.data.City,
      Country: e.data.Country
    };
    return model;
  }

  valRowCell(e): boolean {
    let ID: any;
    let Code: any;
    let boolState = true;

    if (e.data) {
      Code = e.data.AcAccount ? e.data.Code : null;

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
    this.lstCountry = [{ id: 1, name: 'Colombia' }, { id: 2, name: 'Venezuela' }];
    setTimeout(obj => {

    }, 1000);
    this.loadCatalog();
  }

  async loadCatalog() {
    await this.getData();
  }

  getDataCountry() {
    return {
      store: this.lstCountry,
      paginate: true,
      loadMode: 'raw'
    };
  }

  onValueChanged(e) {
    this.lstState = locates.getStatesOfCountry(e.value);
  }


  getFilteredDepartment(options) {
    const lst = locates.getStatesOfCountry(options.data.Country.toString());
    return {
      store: lst,
      paginate: true,
      loadMode: 'raw'
    };
  }

  getFilteredCity(options) {
    const self = this as any;
    return {
      store: self.lstState,
      paginate: true,
      loadMode: 'raw'
    };
  }

  setStateValueCountry(rowData: any, value: any): void {
    rowData.Department = null;
    rowData.City = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }


  setStateValueDepartment(rowData: any, value: any): void {
    rowData.City = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }


  async getData() {

    this.data = [{
      ID: 12,
      Code: 'Comedor1',
      Name: 'Comedor Prueba 1',
      Address: 'Calle falsa 123',
      Phone: 1234545,
      Email: 'Jhonatan@hagonfnm.com',
      Contact: 'Jhonatan',
      ContactEmail: 'Jhonatan@hagonfnm.com',
      ContactPhone: 123466,
      ChildNumber: 45,
      ScheduleReception: '12:10',
      Department: null,
      City: null,
      Country: 1,
      Neighborhood: 'Fatima'
    },
    {
      ID: 13,
      Code: 'Comedor2',
      Name: 'Comedor Prueba 1',
      Address: 'Calle falsa 123',
      Phone: 1234545,
      Email: 'Jhonatan@hagonfnm.com',
      Contact: 'Jhonatan',
      ContactEmail: 'Jhonatan@hagonfnm.com',
      ContactPhone: 123466,
      ChildNumber: 45,
      ScheduleReception: '12:10',
      Department: 47,
      City: null,
      Country: 2,
      Neighborhood: 'San Nicolas'
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
    if (e.dataField === 'ScheduleReception' && e.parentType === 'dataRow') {
      /*e.editorName = 'dxTextBox';
      e.editorOptions.mask = '00:00';*/
    }
  }

  onEditorPrepared(e) {
  }

  calculateSortValue(data) {
    const column = this as any;
    const value = column.calculateCellValue(data);
    return column.lookup.calculateCellValue(value);
  }

}
