const Joi = require('joi');

class BaseRoute {
    constructor(){
        this.__failAction = (request, headers, erro) => {
            //console.error(erro.message)
            throw erro;
        };

        this.__headers = Joi.object({
            authorization: Joi.string().required()
        }).unknown();
    }

    static methods(){ // retorna todos os metodos da classe que não seja o construtor ou comece com _ (privado)
        return Object.getOwnPropertyNames(this.prototype)
            .filter((method) => method !== 'constructor' && !method.startsWith('_'));  
    }
}

module.exports = BaseRoute; 