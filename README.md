<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">Ionic/Angular SQLite App Refactor</h3>
<p align="center"><strong><code>angular-sqlite-app-refactor</code></strong></p>
<p align="center">Ionic/Angular application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite<code></strong></p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2020?style=flat-square" />
  <a href="https://github.com/jepiqueau/angular-sqlite-app-refactor"><img src="https://img.shields.io/github/license/jepiqueau/angular-sqlite-app-refactor?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/angular-sqlite-app-refactor"><img src="https://img.shields.io/github/package-json/v/jepiqueau/angular-sqlite-app-refactor?style=flat-square" /></a>
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
```

 - then go to the building process

```bash
npm run build
npx cap update
npm run build
npx cap copy
npx cap copy web
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

### Test SQLite access

The ```@capacitor-community/sqlite``` test is run automatically in the home page.

The application uses a service class as a wrapper to the ```@capacitor-community/sqlite``` plugin 

### Resulting Output

<p align="center"><br><img src="https://github.com/jepiqueau/angular-sqlite-app-refactor/src/assets/icon/CaptureResult.png" width="150" height="300" /></p>


At the end of the test, two databases should have been created,  


 - testNewSQLite.db
 - testSetSQLite.db encrypted password `sqlite secret`

### Angular Service

A Angular Service has been defined as a wrapper to the ```@capacitor-community/sqlite``` plugin.

```tsx
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
                    sqlitePlugin.requestPermissions();
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