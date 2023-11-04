import { Controller, Get, Param } from "@nestjs/common";
import { AccountService } from "./account.service";

@Controller('/account')
export class AccountController {
    constructor(private _accountService: AccountService){}

    @Get('/verify/:encodedAccountKey')
    async VerifyUserAccount(@Param('encodedAccountKey') id: string): Promise<{Success: boolean}>{
        return await this._accountService.VerifyUserAccount(id)
    }
}