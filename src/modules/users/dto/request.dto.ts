import { Transform } from 'class-transformer'
import {IsNumber, IsOptional} from 'class-validator'
export class GetUsersRequest {
    @IsOptional()
    @Transform(({value})=>parseInt(value))
    @IsNumber()
    Page: number

    @IsOptional()
    @Transform(({value})=>parseInt(value))
    @IsNumber()
    Limit: number

    @IsOptional()
    Search: string
}