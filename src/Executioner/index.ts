import parseSQL from "../Parser";
import { StorageEngine } from "../Storage Engine";

export class Executioner {
    constructor() {

    }
    parser(query: string, storageEngine: StorageEngine) {
        const ast = parseSQL(query);
        this.methodCallHandler(ast, storageEngine)
    }

    private methodCallHandler(ast: any, storageEngine: StorageEngine) {
        switch (ast.type) {
            case "create_database":
                return;
            case "use_database":
                return;

            case "create_table":
                return;

            case "update":
                return;

            case "delete":
                return;
        }
    }
}