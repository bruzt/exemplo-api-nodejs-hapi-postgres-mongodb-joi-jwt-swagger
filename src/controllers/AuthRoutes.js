const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');

const BaseRoute = require('./baseRoute/BaseRoute');
const PasswordHelper = require('./helpers/PasswordHelper');


const route = '/login'

class AuthRoutes extends BaseRoute {
    constructor(db, secret){
        super();
        this.db = db;
        this.secret = secret;
    }

    login(){
        return {
            path: `${route}/token`,
            method: 'POST',
            config: {
                auth: false,
                
                tags: ['api'],
                description: 'Obtem um token de acesso',
                notes: 'Faz login com user e senha cadastrado',

                validate: {
                    failAction: this.__failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload;

                const [user] = await this.db.read({
                    username: username.toLowerCase()
                });

                if(!user) return Boom.unauthorized('Usuario ou senha inválidos');

                const match = await PasswordHelper.comparePassword(password, user.password);

                if(!match) return Boom.unauthorized('Usuario ou senha inválidos');

                const token = Jwt.sign({
                    id: user.id,
                    username: username
                }, this.secret, 
                { expiresIn: 43200 }); // Token é valida por 12 horas

                return { token }
            }
        }
    }

    changePasswd(){
        return {
            path: `${route}/change`,
            method: 'PATCH',
            config: {
                auth: false,

                tags: ['api'],
                description: 'Altera a senha',
                notes: 'Altera a senha atual por uma nova senha',
                
                validate: {
                    failAction: this.__failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                        newPassword: Joi.strict().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    let { username, password, newPassword } = request.payload;

                    const [user] = await this.db.read({
                        username: username.toLowerCase()
                    });
    
                    if(!user) return Boom.unauthorized('Usuario ou senha inválidos');
    
                    const match = await PasswordHelper.comparePassword(password, user.password);
    
                    if(!match) return Boom.unauthorized('Usuario ou senha inválidos');

                    password = { password: await PasswordHelper.hashPassword(newPassword) };

                    await this.db.update(null, password, false, user.username);

                    return {
                        message: 'Senha trocada com sucesso!'
                    }
                    
                } catch (error) {
                    return Boom.preconditionFailed('Usuário ou senha incorreta');
                }
            }
        }
    }
}

module.exports = AuthRoutes;