import { Injectable } from '@angular/core';

import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { SQLiteDBConnection, SQLiteConnection,
         capEchoResult, capSQLiteResult } from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;

@Injectable({
    providedIn: 'root'
})

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
                resolve(true);
            }
        });
    }
    async echo(value: string): Promise<capEchoResult> {
        if(this.sqlite != null) {
            return await this.sqlite.echo(value);
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
}
