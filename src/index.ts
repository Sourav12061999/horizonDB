
import { StorageEngine } from "./Storage Engine";
class Main {

    storageEngine: StorageEngine | null = null;
    static instance: Main | null = null;
    private constructor() {
        Main.connect();
    }

    static async connect() {
        Main.instance = new Main();
    }
}