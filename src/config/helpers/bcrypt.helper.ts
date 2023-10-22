import * as bcrypt from 'bcrypt'

export const createHash = (data: string): string=>{
    console.log(process.env.HASH_SALT)
    let salt = bcrypt.genSaltSync(parseInt(process.env.HASH_SALT))
    return bcrypt.hashSync(data, salt)
}

export const compareHash = (data:string, hash: string): boolean=>{
    return bcrypt.compareSync(data, hash)
}
