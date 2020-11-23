import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export function deleteDatabase(db: SQLiteDBConnection): boolean {
    let ret: any = db.isExists();
    const dbName = db.getConnectionDBName();
    if(ret) {
      console.log("$$$ database " + dbName + " deleted");
      ret = db.delete();
    }
    return ret;
}
