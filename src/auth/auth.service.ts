import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, BadGatewayException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
    private readonly JwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const userDb = await this.UserModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      const user = userDb.toJSON()
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: userDb.id })
      };

    } catch (error) {
      this.handleDbErrors(error)
    }
  }

  async findAll() {
    return this.UserModel.find(); 
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const userDb = await this.UserModel.findOne()
      .where({ email })
      .select({ email: true, password: true, _id: true, isActive: true, role: true, username: true })

    if (!userDb) throw new UnauthorizedException('El usuario o contraseña no son correctas');

    // if (userDb.role !== 'admin') throw new UnauthorizedException('El usuario no es administrador.');

    if (!bcrypt.compareSync(password, userDb.password)) throw new UnauthorizedException('El usuario o contraseña no son correctas');

    const user = userDb.toJSON()
    delete user.password

    return {
      ...user,
      token: this.getJwtToken({ id: userDb.id })
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    const user = await this.UserModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true })
    if (!user) throw new BadRequestException('No existe el usuario por ese id.');
    return user
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('El id no es valido');
    return this.UserModel.findOneAndDelete({ _id: id });
  }

  async verify(user) {
    return {
      token: this.JwtService.sign({ id: user._id }),
      ...user
    }
  }

  google(req) {
    if (!req.user) {
      return 'No user from google'
    }
    return {
      ...req.user
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.JwtService.sign(payload);
  }

  private handleDbErrors(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('El usuario ya existe!');

    }
    console.log(error)
    throw new InternalServerErrorException('Por favor revisar la consola.');
  }

}