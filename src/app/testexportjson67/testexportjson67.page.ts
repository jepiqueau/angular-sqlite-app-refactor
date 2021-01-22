import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { DetailService } from '../services/detail.service';
import { tableSchema } from '../utils/issue67-utils';
import { deleteDatabase } from '../utils/db-utils';

@Component({
  selector: 'app-testexportjson67',
  templateUrl: 'testexportjson67.page.html',
  styleUrls: ['testexportjson67.page.scss']
})
export class Testexportjson67Page implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService,
              private _detailService: DetailService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    console.log("%%%% in Testexportjson67Page this._sqlite " + 
                                                  this._sqlite)

    const result: boolean = await this.runTest();
    if(result) {
      document.querySelector('.sql-allsuccess').classList
      .remove('display');
      console.log("$$$ runTest was successful");
    } else {
      document.querySelector('.sql-allfailure').classList
      .remove('display');
      console.log("$$$ runTest failed");
    }
  }


  async runTest(): Promise<boolean> {
    let result: any = await this._sqlite.echo("Hello World");
    console.log(" from Echo " + result.value);

    // initialize the connection
    const db = await this._sqlite
                .createConnection("testIssue67", false, "no-encryption", 1);
    console.log("db " + db)

    // check if the databases exist 
    // and delete it for multiple successive tests
    let ret: any = await deleteDatabase(db);
    // open db testNew
    ret = await db.open();
    if (!ret.result) {
      return false;
    }

    // create tables in db
    ret = await db.execute(tableSchema);
    console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }

    // create synchronization table 
    ret = await db.createSyncTable();
    if (ret.changes.changes < 0) {
      return false;
    }
    
    // set the synchronization date
    let date = new Date();
    date.setHours(date.getHours() - 2);
    let syncDate: string = date.toISOString();
    console.log(`$$$ syncDate ${syncDate}`)
    ret = await db.setSyncDate(syncDate);
    if(!ret.result) return false;
    result = await db.getSyncDate();
    if(result.syncDate === 0) return false;
    console.log("$$ initial syncDate " + result.syncDate);

    // add one user to a class              
    let sqlcmd: string = 
          "INSERT INTO class (userId,className,description) VALUES (?,?,?);";
    let values: Array<any>  = [1,1,"MA","Master of Atrs"];
    ret = await db.run(sqlcmd,values);
    console.log()
    if(ret.changes.lastId !== 1) {
      return false;
    }
    // add the same user to another class              
    sqlcmd = "INSERT INTO section (userid,classId,sectionName,description) VALUES (?,?,?,?);";
    values = [1,1,"Morning","Morning - From 8AM to 9AM"];
    ret = await db.run(sqlcmd,values);
    console.log()
    if(ret.changes.lastId !== 1) {
      return false;
    }
    let partial = await db.exportToJson('partial');
    console.log(JSON.stringify(partial.export));
    // test Json object validity
    result = await this._sqlite
                          .isJsonValid(JSON.stringify(partial.export));
    if(!result.result) {
      console.log(`isJsonValid: ${result.message}`);
      return false;
    }
                          
    // set the synchronization date
    syncDate = (new Date()).toISOString();
    ret = await db.setSyncDate(syncDate);
    if(!ret.result) return false;
    console.log(`$$$ syncDate ${syncDate}`)
    result = await db.getSyncDate();
    if(result.syncDate === 0) return false;
    console.log("$$ final syncDate " + result.syncDate);
    

    // close the connection
    result = await this._sqlite.closeConnection("testIssue67"); 
    if(!result.result) return false; 
    this._detailService.setExportJson(false);

    return true;
    

  }

}
