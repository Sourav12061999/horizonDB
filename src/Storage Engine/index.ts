import Database from "./Database";

export class StorageEngine {
    static storageInstance: StorageEngine | null = null;
    private currentDatabase: Database | null = null;
    private allDatabases: Array<Database> | [] = [];
    private constructor() { }

    connect(): StorageEngine {
        if (StorageEngine.storageInstance === null) {
            StorageEngine.storageInstance = new StorageEngine();
        }
        return StorageEngine.storageInstance;
    }

    private loadDatabases(): void {

    }
}