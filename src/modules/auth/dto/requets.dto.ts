import { IsEmail, IsAlpha, Min, IsNotEmpty } from "class-validator";

export class SignUpRequest {
    @IsAlpha()
    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string;
}

export class LoginRequest {
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string
}