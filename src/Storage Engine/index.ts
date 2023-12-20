import Database from "./Database";

interface DatabaseStorage {
    [key: string]: Database;
}
export class StorageEngine {
    static storageInstance: StorageEngine | null = null;
    private currentDatabase: Database | null = null;
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
}