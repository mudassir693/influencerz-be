import { BadRequestException, Injectable } from "@nestjs/common";
import { ApplicationErrors } from "src/config/errors";
import { DatabaseService } from "src/database/database.service";
import { accountStatuses } from "./account.entity";
import { CryptoDecryption } from "src/config/helpers/crypto.helper";

@Injectable()
export class AccountService {
    constructor(private _dbService: DatabaseService){}

    async VerifyUserAccount(accountKey: string){

        let DecodedCipher = await CryptoDecryption(accountKey)
        const Account = await this._dbService.account.findFirst({where: {accountKey: DecodedCipher, status: accountStatuses.PENDING}})

        if(!Account){
            throw new BadRequestException(ApplicationErrors.ACCOUNT_NOT_FOUND)
        }
        await this._dbService.account.update({where: {id: Account.id}, data:{status: accountStatuses.ACTIVE}})
        return {
            Success: true
        }
    }
}