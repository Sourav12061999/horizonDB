import parseSQL from "../Parser";
import { StorageEngine } from "../Storage Engine";

export class Executioner {
    constructor() {

    }
    async parser(query: string, storageEngine: StorageEngine) {
        const ast = parseSQL(query);
        await this.methodCallHandler(ast, storageEngine)
    }

    private async methodCallHandler(ast: any, storageEngine: StorageEngine) {
        switch (ast.type) {
            case "create_database":
                await storageEngine.createDatabase("");
                return;
            case "use_database":
                storageEngine.useDatabase("");
                return;
            case "create_table":
                await storageEngine.createtable("", {});
                return;

            case "update":
                await storageEngine.updteTableRow("")
                return;

            case "delete":
                await storageEngine.deleteTableRow("")
                return;
        }
    }
}