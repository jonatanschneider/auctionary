import * as pGoogle from 'passport-instagram';
import * as request from 'request-promise';
import { AuthenticationConfig } from './AuthenticationConfig';
import { Express } from 'express';
import { PassportStatic } from 'passport';
import { Collection, MongoError } from 'mongodb';
import { LoginProvider } from '../model/LoginProvider';
import { User } from '../model/User';
import { Login } from '../model/Login';

export class InstagramAuth {

}