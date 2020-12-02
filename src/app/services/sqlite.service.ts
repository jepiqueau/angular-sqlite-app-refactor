import { Injectable } from '@angular/core';

import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capEchoResult, capSQLiteResult } from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;

@Injectable()

export class SQLiteService {
    handlerPermissions: any;
    sqlite: SQLiteConnection;
    isService: boolean = false;
    platform: string;

    constructor() {
    }
      /**
   * Plugin Initialization
   */
    initializePlugin(): Promise<boolean> {
        return new Promise (resolve => {
            this.platform = Capacitor.platform;
            console.log("*** platform " + this.platform)
            const sqlitePlugin: any = CapacitorSQLite;
            if(this.platform === "android") {
                this.handlerPermissions = sqlitePlugin.addListener(
                    'androidPermissionsRequest', async (data:any) => { 
                    if (data.permissionGranted === 1) {
                        this.handlerPermissions.remove();
                        this.sqlite = new SQLiteConnection(sqlitePlugin);
                        this.isService = true;
                        resolve(true);
                    } else {
                        console.log("Permission not granted");
                        this.handlerPermissions.remove();
                        this.sqlite = null;
                        resolve(false);
                    }      
                });
                try {
                    console.log("%%%%% before requestPermissions");
                    sqlitePlugin.requestPermissions();
                    console.log("%%%%% after requestPermissions");
                } catch (e) {
                    console.log("Error requesting permissions " + JSON.stringify(e));
                    resolve(false);
                }
            } else {
                this.sqlite = new SQLiteConnection(sqlitePlugin);
                this.isService = true;
                console.log("$$$ in service this.isService " + this.isService + " $$$")
                resolve(true);
            }
        });
    }
    async echo(value: string): Promise<capEchoResult> {
        console.log("&&&& in echo this.sqlite " + this.sqlite + " &&&&")
        if(this.sqlite != null) {
            return await this.sqlite.echo(value);
        } else {
            return null;
        }
    }
    async addUpgradeStatement(database:string, fromVersion: number,
                              toVersion: number, statement: string,
                              set?: capSQLiteSet[])
                                        : Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.addUpgradeStatement(database,
                fromVersion, toVersion, statement, set ? set : []);
        } else {
            return null;
        }                             
    }
    
    async createConnection(database:string, encrypted: boolean,
                           mode: string, version: number
                           ): Promise<SQLiteDBConnection | null> {
        if(this.sqlite != null) {
            const db: SQLiteDBConnection = await this.sqlite.createConnection(
                                database, encrypted, mode, version);
            if (db != null) {
                return db;
            } else {
                return null
            }
        } else {
            return null;
        }
    }
    async closeConnection(database:string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.closeConnection(database);
        } else {
            return null;
        }
    }
    async retrieveConnection(database:string): 
            Promise<SQLiteDBConnection | null | undefined> {
        if(this.sqlite != null) {
            return await this.sqlite.retrieveConnection(database);
        } else {
            return null;
        }
    }
    async retrieveAllConnections(): 
                    Promise<Map<string, SQLiteDBConnection>> {
        if(this.sqlite != null) {
            const myConns =  await this.sqlite.retrieveAllConnections();
            let keys = [...myConns.keys()];
            keys.forEach( (value) => {
                console.log("Connection: " + value);
              }); 
              return myConns;
        } else {
            return null;
        }               
    }
    async closeAllConnections(): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            return await this.sqlite.closeAllConnections();
        } else {
            return null;
        }
    }

}
