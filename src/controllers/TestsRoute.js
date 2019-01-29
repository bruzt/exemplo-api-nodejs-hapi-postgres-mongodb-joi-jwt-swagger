const BaseRoute = require('./baseRoute/BaseRoute');
const Joi = require('joi');
const { join } = require('path');


class TestsRoutes extends BaseRoute {

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                auth: false,
                validate: {
                    failAction: this.__failAction,
                    //headers: this.__headers,
                    }
                },            
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true

                }
            }
        }
    }
}

module.exports = TestsRoutes;