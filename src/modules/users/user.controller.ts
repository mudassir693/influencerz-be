import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import {AuthGuard} from '@nestjs/passport'
import { JwtAuthGuard } from "../guards/jwt.guard";
@Controller('/users')
export class UserController {
    constructor(){}

    @UseGuards(JwtAuthGuard)
    @Get('')
    TestAuth(@Request() request: any){
        return 
    }
}