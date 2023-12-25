import Database from "./Database";
import { ISchema } from "./Tables";

interface DatabaseStorage {
    [key: string]: Database;
}
export class StorageEngine {
    static storageInstance: StorageEngine | null = null;
    private static currentDatabase: string | null = null;
    private static allDatabases: DatabaseStorage = {};
    private constructor() { }

    static async connect() {
        if (StorageEngine.storageInstance === null) {
            StorageEngine.storageInstance = new StorageEngine();
        }
        await StorageEngine.loadDatabases();
        return StorageEngine.storageInstance;
    }

    private static async loadDatabases() {
        const dbs = await Database.loadAllDatabases();
        const dbInstances = await Promise.all(dbs);
        dbInstances.forEach(database => {
            StorageEngine.allDatabases[database.db] = database;
        })
    }

    static useDatabase(db: string) {
        if (!this.allDatabases[db]) {
            throw new Error(`Database ${db} does not exist`);
        }
        StorageEngine.currentDatabase = db;

    }

    static async createtable(tableName: string, schema: ISchema) {
        if (!StorageEngine.currentDatabase) {
            throw new Error(`No database selected`);
        }
        await this.allDatabases[this.currentDatabase!].createNewTable(tableName, schema);
    }

    static async createDatabase(dbName: string) {
        StorageEngine.allDatabases[dbName] = await Database.craeteNewDatabaseHandler(dbName);
    }
}