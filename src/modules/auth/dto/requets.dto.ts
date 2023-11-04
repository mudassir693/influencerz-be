import { IsEmail, IsAlpha, Min, IsNotEmpty, IsAlphanumeric } from "class-validator";

export class SignUpRequest {
    @IsNotEmpty()
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