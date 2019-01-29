const BaseRoute = require('./baseRoute/BaseRoute');


class DefaultRoute extends BaseRoute {

    root(){
        return {
            path: '/',
            method: 'GET',
            config: {
                auth: false,
                validate: {
                    failAction: this.__failAction
                }
            },
            handler: (request, reply) => {
                try {
                    
                return 'Acesse /documentation';

                } catch (error) {
                    console.error("Erro no DefaultRoute", error);
                }
            }
        }
    }
}

module.exports = DefaultRoute;