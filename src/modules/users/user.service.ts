import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetUsersRequest } from './dto/request.dto';
import { NotFound } from '@aws-sdk/client-s3';
import { ApplicationErrors } from 'src/config/errors';
import { createHash } from 'src/config/helpers/bcrypt.helper';

@Injectable()
export class UserService {
  constructor(private _dbService: DatabaseService) {}

  async GetUsers(data: GetUsersRequest) {
    let whereParams: any = {};

    if (data.Search) {
    }
    let users = await this._dbService.user.findMany({
      where: data.Search && {
        OR: [
          data.Search && { email: { contains: data.Search } },
          data.Search && {
            name: { contains: data.Search, mode: 'insensitive' },
          },
        ],
      },
      include: {
        account: true,
      },
    });

    let count = await this._dbService.user.count({
      where: data.Search && {
        OR: [
          data.Search && { email: { contains: data.Search } },
          data.Search && {
            name: { contains: data.Search, mode: 'insensitive' },
          },
        ],
      },
    });
    return {
      users,
      count,
    };
  }

  async GetUser(userId: string) {
    let user = await this._dbService.user.findUnique({
      where: { id: parseInt(userId) },
      include: { account: true },
    });

    if(!user) {
        throw new NotFoundException(ApplicationErrors.NOT_FOUND)
    }
    return user;
  }

  async UpdateUserInfo(data: any, userPayload: any) {
    let user = await this._dbService.user.findUnique({
      where: { id: userPayload.userId },
    });
    if (!user) {
      throw new NotFoundException(ApplicationErrors.NOT_FOUND);
    }
    let hashedPassword: string
    if(data.password){
        hashedPassword = createHash(data.password)
    }

    let updateUser = await this._dbService.user.update({
      where: { id: userPayload.userId },
      data: { 
        ...(data.name && {name: data.name}),
        ...(data.avatar && {avatar: data.avatar}),
        ...(data.password && hashedPassword && {password: hashedPassword})
      },
    });

    return {
        Success: true
    }
  }

  async deleteUser(userId, userPayload: any){
    if(userId != userPayload.userId){
        throw new BadRequestException(ApplicationErrors.ACCESS_NOT_ALLOWED)
    }
    let user = await this._dbService.user.findUnique({where: {id: userPayload.userId}})
    if(!user){
        throw new NotFoundException(ApplicationErrors.NOT_FOUND)
    }

    await this._dbService.user.delete({
        where: { id: userPayload.userId}
    })

    return {
        Success: true
    }
  }
}
