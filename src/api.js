const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev"; // se não passar nada é "dev"
ok(env === "prod" || env === "dev", '"env" inválida. Apenas "dev" ou "prod"');

const configPath = join(__dirname, '../config', `.env.${env}`);

config({
    path: configPath // Define as variaveis de ambiente
});

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const Postgres = require('./db/Postgres');
const userSchema = require('./models/postgres/userSchema');

const MongoDB = require('./db/MongoDB');
const PeopleSchema = require('./models/mongodb/peopleSchema');

const TestsRoute = require('./controllers/TestsRoute');
const DefaultRoute = require('./controllers/DefaultRoute');
const PeopleRoutes = require('./controllers/PeopleRoutes');
const AuthRoutes = require('./controllers/AuthRoutes');

const PasswordHelper = require('./controllers/helpers/PasswordHelper');


const app = new Hapi.Server({ port: process.env.API_PORT });

function mapRoutes(instance, methods){  
    return methods.map((method) => instance[method]());
}

function generateSecret(){ // Gera uma nova private key aleatoriamente toda vez que a API é iniciada
    let secret = "";
    for(let i=0; i<15; i++){
        secret += Math.random().toString(36).slice(-11);
    }
    return secret;
}

async function main() {
        const secret = generateSecret();

        const mongodb = new MongoDB(PeopleSchema);

        const postgres = new Postgres(userSchema);

        await app.register([
            HapiJwt,
            Vision,
            Inert,
            {
                plugin: HapiSwagger,
                options: {
                    info: {
                        title: 'API',
                        version: '1.0.2'
                    },
                    lang: 'pt'
                }
            }
        ]);

        app.auth.strategy('jwt', 'jwt', {
            key: secret, // jwtSecret.secret,
            validate: async (data, request) => {
                // Valida se o usuario continua ativo mesmo já tendo uma token
                const [response] = await postgres.read({
                    username: data.username.toLowerCase(),
                    id: data.id
                });

                if(!response) return { isValid: false };

                return { isValid: true }
            }
        });
        
        app.auth.default('jwt');

        app.route([ // ... -> spread
            ...mapRoutes(new TestsRoute(), TestsRoute.methods()),
            ...mapRoutes(new DefaultRoute(), DefaultRoute.methods()),

            ...mapRoutes(new PeopleRoutes(mongodb), PeopleRoutes.methods()),
            ...mapRoutes(new AuthRoutes(postgres, secret), AuthRoutes.methods())
        ]);

        //#################################################
        const CREATE_USER_DB = {
            username: 'admin',
            password: await PasswordHelper.hashPassword('admin')
        }
        //await new Promise((resolve) => setTimeout(resolve, 5000));        
        await postgres.update(null, CREATE_USER_DB, upsert=true);
        //#################################################
  
        await app.start();
        //console.log('app rodando na porta', app.info.port);
    
        return app;
}

module.exports = main();