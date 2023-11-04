import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { compareHash, createHash } from "src/config/helpers/bcrypt.helper";
import { DatabaseService } from "src/database/database.service";
import { LoginRequest, SignUpRequest } from "./dto/requets.dto";
import { user } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { CryptoEncryption } from "src/config/helpers/crypto.helper";

@Injectable()
export class AuthService {
    constructor(private _dbService: DatabaseService, private _jwtService: JwtService, private _mailService: MailService){}

    async Signup(data: SignUpRequest): Promise<{success: boolean}>{
        const user: user = await this._dbService.user.findFirst({where:{email: data.email}})
        if(user){
            throw new BadRequestException('User already exist')
        }

        const hashedPassword = createHash(data.password)
        let createUser = await this._dbService.user.create({data:{
            name: data.name,
            email: data.email,
            password: hashedPassword
        }})
        let CreatedAccount = await this._dbService.account.create({
            data:{
                userId: createUser.id,
                status: 'PENDING'
            }
        })

        let Cipher = await CryptoEncryption(CreatedAccount.accountKey)
        this._mailService.AccountConfirmationEmail(data.name, Cipher)
        return {
            success: true
        }
    }

    async Login(data: LoginRequest){
        let user: user = await this._dbService.user.findUnique({where: {email: data.email}})
        if(!user){
            throw new NotFoundException('No record found with this email.')
        }
        let isPasswordMath = compareHash(data.password, user.password)
        if(!isPasswordMath){
            return new BadRequestException("Invalid password.")
        }

        let payload = { email: user.email, id: user.id }
        
        return {
            accessToken: this._jwtService.sign(payload)
        }
    }

    async ValidateUser(email: string, password: string){
        let user: user = await this._dbService.user.findUnique({where: {email: email}})
        if(!user){
            return null
        }
        let isPasswordMath = compareHash(password, user.password)
        if(!isPasswordMath){
            throw new BadRequestException("Invalid password.")
        }
        return user
    }
}