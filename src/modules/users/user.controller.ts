import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Query, Request, UseGuards } from "@nestjs/common";
import {AuthGuard} from '@nestjs/passport'
import { JwtAuthGuard } from "../passport/guards/jwt.guard";
import { UserService } from "./user.service";
import { GetUsersRequest } from "./dto/request.dto";
import { ApplicationErrors } from "src/config/errors";
@Controller('/users')
export class UserController {
    constructor(private _userService: UserService){}

    // @UseGuards(JwtAuthGuard)
    @Get('/')
    async GetUsers(@Query() data: GetUsersRequest, @Request() request){
        console.log("this fn hit")
        return this._userService.GetUsers(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async GetUser(@Param('id') id: string, @Request() request){
        if(request.user.userId != id){
            throw new BadRequestException(ApplicationErrors.ACCESS_NOT_ALLOWED)
        }
        return this._userService.GetUser(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('')
    async UpdateUserInfo(@Body() body: any, @Request() request){
        return this._userService.UpdateUserInfo(body, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async DeleteUserInfo(@Param("id") id: number, @Request() request){
        return this._userService.deleteUser(id, request.user)
    }
}