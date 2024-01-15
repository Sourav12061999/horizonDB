
import { StorageEngine } from "./Storage Engine";
import Parser from "./Parser";
class Main {
    storageEngine: StorageEngine | null = null;
    static instance: Main | null = null;
    selectedDB: string | null = null;
    private constructor(afterSetupCallback: () => void) {
        StorageEngine.connect().then((engine) => {
            this.storageEngine = engine;
            afterSetupCallback();
        });
    }

    static async connect(afterSetupCallback: () => void) {
        if (!Main.instance) {
            Main.instance = new Main(afterSetupCallback);
        }
        return Main.instance


    }

    async parser(query: string) {
        const ast = Parser.parseSQL(query)[0];
        console.log(JSON.stringify(ast));
        
        // await this.methodCallHandler(ast)
    }

    private async methodCallHandler(ast: any) {

        if (!this.storageEngine) {
            throw new Error("StorageEngine setup is not complete yet.");
        }
        switch (ast.type) {
            case "create_database":
                if (!ast?.name?.value) {
                    throw new Error("Syntax error in create database");
                }
                await this.storageEngine.createDatabase(ast?.name?.value);
                return;
            case "use_database":
                
                this.storageEngine.useDatabase(ast?.name?.value);
                return;
            case "create_table":
                await this.storageEngine.createtable("", {});
                return;

            case "update":
                await this.storageEngine.updteTableRow("")
                return;

            case "delete":
                await this.storageEngine.deleteTableRow("")
                return;
        }
    }
}

Main.connect(() => {
    console.log("Setup complete");
    Main.instance?.parser(`select * from students where id = 1`);

});