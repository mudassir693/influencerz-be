import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest, SignUpRequest } from "./dto/requets.dto";

@Controller('/auth')
export class AuthController{
    constructor(private _authService: AuthService){}

    @Post('/signup')
    async SignUp(@Body() data: SignUpRequest){
        return await this._authService.Signup(data)
    }

    @Post('/login')
    async Login(@Body() data: LoginRequest){
        return await this._authService.Login(data)
    }
}