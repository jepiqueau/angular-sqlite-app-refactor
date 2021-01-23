<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Angular SQLite App Refactor</h3>
<p align="center"><strong><code>angular-sqlite-app-refactor</code></strong></p>
<p align="center">Ionic/Angular application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite</code></strong></p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2021?style=flat-square" />
  <a href="https://github.com/jepiqueau/angular-sqlite-app-refactor"><img src="https://img.shields.io/github/license/jepiqueau/angular-sqlite-app-refactor?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/angular-sqlite-app-refactor"><img src="https://img.shields.io/github/package-json/v/jepiqueau/angular-sqlite-app-refactor/refactor?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Installation

To start building your App using this Starter App, clone this repo to a new directory:

```bash
git clone https://github.com/jepiqueau/angular-sqlite-app-refactor.git 
cd angular-sqlite-app-refactor
git remote rm origin
```

 - then install it

```bash
npm install
cd electron
npm install
cd ..
```

 - then go to the building process

```bash
npm run build
npx cap sync
npx cap sync @capacitor-community/electron
npm run build
npx cap copy
npx cap copy web
npx cap copy @capacitor-community/electron
```

the capacitor config parameters are:

```
  "appId": "io.ionic.starter",
  "appName": "test-capacitor-sqlite",
```

### Building Web Code

The ```@capacitor-community/sqlite``` is not implemented for Web Browsers.
if you run

```bash
npx cap serve
```
you will get the following messages:
```
SQLite Plugin not available for Web Platform
```

### Building Native Project


#### Android

```bash
npx cap open android
```
Once Android Studio launches, you can build your app through the standard Android Studio workflow.

### iOS

```bash
npx cap open ios
```

### Electron

```bash
npx cap open @capacitor-community/electron
```

### Test SQLite access

The ```@capacitor-community/sqlite``` tests are accessible through the home page.

 - Test 2 Databases
 

The application uses a service class as a wrapper to the ```@capacitor-community/sqlite``` plugin 

### Resulting Output

<p align="center"><br><img src="https://github.com/jepiqueau/angular-sqlite-app-refactor/blob/refactor/src/assets/icon/CaptureResult.png" width="200" height="400" /></p>


At the end of the test, three databases should have been created,  


 - testNewSQLite.db
 - testSetSQLite.db encrypted password `sqlite secret`
 - test-updversionSQLite.db 

### Angular Service

A Angular Service has been defined as a wrapper to the ```@capacitor-community/sqlite``` plugin and from release `2.9.0-alpha.5` can be used at a `singleton service` initialized in `app.component.ts` and imported as a provider in `app.module.ts`. In this case the `DBConnection` can be used through Pages (see example in `existingconnection.page.ts` which can be called after the execution of `test2dbs.page.ts`).

```tsx
import { Injectable } from '@angular/core';

import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { SQLiteDBConnection, SQLiteConnection, capSQLiteSet,
         capEchoResult, capSQLiteResult } from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;

@Injectable()

export class SQLiteService {
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
            this.sqlite = new SQLiteConnection(sqlitePlugin);
            this.isService = true;
            console.log("$$$ in service this.isService " + this.isService + " $$$")
            resolve(true);
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
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br /><sub><b>Jean Pierre Quéau</b></sub></a><br /><a href="https://github.com/jepiqueau/angular-sqlite-app-refactor/commits?author=jepiqueau" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
