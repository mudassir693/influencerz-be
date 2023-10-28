import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports:[DatabaseModule],
    providers:[UserService],
    controllers:[UserController],
    exports: [UserService]
})
export class UserModule {}