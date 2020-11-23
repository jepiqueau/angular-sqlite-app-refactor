import { Component, AfterViewInit } from '@angular/core';
import { SQLiteService } from '../services/sqlite.service';
import { createSchema, twoUsers } from '../utils/no-encryption-utils';
import { createSchemaContacts, setContacts } from '../utils/encrypted-set-utils';
import { deleteDatabase } from '../utils/db-utils';
@Component({
  selector: 'app-test2dbs',
  templateUrl: 'test2dbs.page.html',
  styleUrls: ['test2dbs.page.scss'],
})
export class Test2dbsPage implements AfterViewInit {
  sqlite: any;
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SQLiteService) {}

  async ngAfterViewInit() {
    // Initialize the CapacitorSQLite plugin
    this.initPlugin = await this._sqlite.initializePlugin();
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
                .createConnection("testNew", false, "no-encryption", 1);
    const db1 = await this._sqlite
                .createConnection("testSet", true, "secret", 1);
    // check if the databases exist 
    // and delete it for multiple successive tests
    let ret: any = deleteDatabase(db);
    ret = deleteDatabase(db1);

    // open db testNew
    ret = await db.open();
    if (!ret.result) {
      return false;
    }
    // create tables in db
    ret = await db.execute(createSchema);
    console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }
    // add two users in db
    ret = await db.execute(twoUsers);
    if (ret.changes.changes !== 2) {
      return false;
    }
    // select all users in db
    ret = await db.query("SELECT * FROM users;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // open db testSet
    ret = await db1.open();
    if (!ret.result) {
      return false;
    }
    // create tables in db1
    ret = await db1.execute(createSchemaContacts);
    console.log('$$$ ret.changes.changes in db1' + ret.changes.changes)
    if (ret.changes.changes < 0) {
      return false;
    }
    // load setContacts in db1
    ret = await db1.executeSet(setContacts);
    console.log('$$$ ret.changes.changes in db2' + ret.changes.changes)
    if (ret.changes.changes !== 5) {
      return false;
    }

    // select users where company is NULL in db
    ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
    if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                  ret.values[1].name !== "Jones") {
      return false;
    }
    // add one user with statement and values              
    let sqlcmd: string = 
                "INSERT INTO users (name,email,age) VALUES (?,?,?)";
    let values: Array<any>  = ["Simpson","Simpson@example.com",69];
    ret = await db.run(sqlcmd,values);
    console.log()
    if(ret.changes.lastId !== 3) {
      return false;
    }
    // add one user with statement              
    sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                              `("Brown","Brown@example.com",15)`;
    ret = await db.run(sqlcmd);
    if(ret.changes.lastId !== 4) {
      return false;
    }
    ret = await this._sqlite.closeConnection("testNew"); 
    if(!ret.result) {
      return false; 
    }
//1234567890123456789012345678901234567890123456789012345678901234567890
    ret = await this._sqlite.closeConnection("testSet"); 
    if(!ret.result) {
      return false; 
    } else {
      return true;
    }

  }

}
