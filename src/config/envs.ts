import 'dotenv/config';
import * as joi from 'joi';

interface ENVSPROPS {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown();

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const ENVS: ENVSPROPS = value;

export const envs = {
  PORT: ENVS.PORT || 4000,
  DATABASE_URL: ENVS.DATABASE_URL,
  JWT_SECRET: ENVS.JWT_SECRET,
};
