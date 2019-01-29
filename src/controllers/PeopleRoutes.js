const Joi = require('joi');
const Boom = require('boom');

const BaseRoute = require('./baseRoute/BaseRoute');


const route = '/people';

class PeopleRoutes extends BaseRoute {
    constructor(db){
        super();
        this.db = db;
    }

    create(){
        return {
            path: `${route}/create`,
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastra uma pessoa',
                notes: 'Cadastra o nome e a idade',

                validate: {
                    failAction: this.__failAction, // lança o erro
                    headers: this.__headers,
                    payload: {
                        name: Joi.string().required().min(3).max(100),
                        age: Joi.string().required().min(1).max(3)                    
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { name, age } = request.payload;
                    const result = await this.db.create({ name, age });

                    return {
                        message: "Pessoa cadastrada com sucesso",
                        _id: result._id
                    }

                } catch (error) {
                    //console.error('Erro no Create: ', error);
                    return Boom.internal();
                }
            }
        }
    }

    read() {
        return {
            path: `${route}/read`,
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Lista todas as pessoas ou busca pelo nome',
                notes: 'Pode paginar resultados e pesquisar por nome',

                validate: { // Validar: payload -> body, headers -> header, params -> na URL {id}, query -> ?skip=0&limit=10
                    failAction: this.__failAction,
                    query: {
                        name: Joi.string().min(1).max(100),
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10)
                    },
                    headers: this.__headers
                }
            },
            handler: (request, headers) => {
                try {
                    const { name, skip, limit } = request.query;
                    
                    const objName = (name) ? { // Verifica se algum nome foi passado
                        name: {$regex: `.*${name}*.`} // caso foi -> retorna todos os mais parecidos
                    } : {}; // caso não -> retorna objeto vazio
                   
                    return this.db.read(objName, skip, limit);

                } catch (error) {
                    //console.error('Erro no list: ', error);
                    return Boom.internal();
                }
                
            }
        }
    }

    readById() {
        return {
            path: `${route}/read/{id}`,
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Busca uma pessoa pelo ID',
                notes: 'Busca uma pessoa pelo ID',

                validate: { // Validar: payload -> body, headers -> header, params -> na URL {id}, query -> ?skip=0&limit=10
                    failAction: this.__failAction,
                    params: {
                        id: Joi.string().required(),
                    },
                    headers: this.__headers
                }
            },
            handler: (request, headers) => {
                try {
                    const { id, skip, limit } = request.params;
                   
                    return this.db.read({ _id: id }, skip, limit);

                } catch (error) {
                    //console.error('Erro no list: ', error);
                    return Boom.internal();
                }
                
            }
        }
    }

    update(){
        return {
            path: `${route}/update/{id}`,
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualiza dados de uma pessoa',
                notes: 'Atualiza nome e/ou sobrenome pelo ID',
                
                validate: {
                    failAction: this.__failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    headers: this.__headers,
                    payload: {
                        name: Joi.string().min(3).max(100),
                        age: Joi.string().min(2).max(50) 
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    
                    try {
                        // JSON.parse e stringfy: para eliminar chaves com valor undefined, atualizando apenas o que foi passado
                        const response = await this.db.update(id, JSON.parse(JSON.stringify(payload))); 
                        
                        if(response.n !== 1) throw Error;

                    } catch (error) {
                        return Boom.preconditionFailed('ID não encontrado no DB');
                    }
                    
                    return {
                        id,
                        message: 'Pessoa atualizada com sucesso'
                    }
                    
                } catch (error) {
                    //console.error(error.message);
                    return Boom.internal();
                }
            }
        }
    }

    delete(){
        return {
            path: `${route}/delete/{id}`,
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remove uma pessoa do banco de dados',
                notes: 'Remove pelo ID',

                validate: {
                    failAction: this.__failAction,
                    headers: this.__headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    
                    try{
                        const response = await this.db.delete(id);
                        
                        if(response.n !== 1) throw Error;
                        
                    } catch {
                        return Boom.preconditionFailed('ID não encontrado no DB');
                    }
                    
                    return {
                        id,
                        message: 'Pessoa deletada com sucesso',
                    }
                    
                } catch (error) {
                    //console.error(error.message);
                    return Boom.internal();
                }
            }
        }
    }
}

module.exports = PeopleRoutes;