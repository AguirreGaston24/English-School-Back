import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile',],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, displayName } = profile
    const userDb = await this.userModel.find({ email: emails[0].value })
    if (!userDb) {
      const newUser = await this.userModel.create({
        email: emails[0].value,
        username: displayName,
        password: bcrypt.hashSync('@', 10),
        role: 'client'
      })
      done(null, newUser);
    }
    done(null, userDb);
  }
}