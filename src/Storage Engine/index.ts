import { error } from "console";
import Database from "./Database";
import { ISchema } from "./Tables";

interface DatabaseStorage {
    [key: string]: Database;
}
export class StorageEngine {
    static storageInstance: StorageEngine | null = null;
    private currentDatabase: string | null = null;
    private allDatabases: DatabaseStorage = {};
    private constructor() { }

    static async connect() {
        if (StorageEngine.storageInstance === null) {
            StorageEngine.storageInstance = new StorageEngine();
        }
        await StorageEngine.loadDatabases();
        return StorageEngine.storageInstance;
    }

    private static async loadDatabases() {
        if (StorageEngine.storageInstance === null) {
            throw new Error("StorageEngine can't be null, there is some issue with loading databases");
        }
        const dbs = await Database.loadAllDatabases();
        const dbInstances = await Promise.all(dbs);
        dbInstances.forEach(database => {
            if (StorageEngine.storageInstance === null) {
                throw new Error("StorageEngine can't be null, there is some issue with loading databases");
            }
            StorageEngine.storageInstance.allDatabases[database.db] = database;
        })
    }

     useDatabase(db: string) {
        if (!this.allDatabases[db]) {
            throw new Error(`Database ${db} does not exist`);
        }
        this.currentDatabase = db;

    }

    async createtable(tableName: string, schema: ISchema) {
        if (!this.currentDatabase) {
            throw new Error(`No database selected`);
        }
        await this.allDatabases[this.currentDatabase!].createNewTable(tableName, schema);
    }

    async createDatabase(dbName: string) {
        this.allDatabases[dbName] = await Database.craeteNewDatabaseHandler(dbName);
    }

    async readFromTable(tableName: string) {
        if (this.currentDatabase === null) {
            throw new Error(`No database selected`);
        }
        this.allDatabases[this.currentDatabase]
    }
    async updteTableRow(tableName: string) {
        if (this.currentDatabase === null) {
            throw new Error(`No database selected`);
        }
        this.allDatabases[this.currentDatabase]
    }
    async deleteTableRow(tableName: string) {
        if (this.currentDatabase === null) {
            throw new Error(`No database selected`);
        }
        this.allDatabases[this.currentDatabase]
    }
}