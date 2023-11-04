import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports:[DatabaseModule],
    providers:[AccountService],
    controllers:[AccountController],
    exports:[AccountService]
})
export class AccountModule {}