const CrudInterface = require('./interfaces/CrudInterface');
const Sequelize = require('sequelize');

class Postgres extends CrudInterface {
    constructor(postgresConnectionData, schema){
        super();
        this._connection = null;
        this._model = null;

        this._connect(postgresConnectionData, schema);
    }

    _connect(schema){
        const connection = new Sequelize(process.env.POSTGRES_URL, {
            quoteIdentifiers: false, // torna nomes das tabelas e atributo case-insensitive
            operatorsAliases: false,
            logging: false,
            ssl: process.env.SSL_POSTGRES,
            dialectOptions: {
                ssl: process.env.SSL_POSTGRES
            }
        });

        this._connection = connection;

        const model = connection.define(schema.name, schema.schema, schema.option);
        model.sync();
        
        this._model = model;
    }

    isConnected(){
        try {
            this._connection.authenticate();
            return true;

        } catch (error) {
            console.error('Error in "isConnected": ', error);
            return false;
        }
    }

    /**
     * ************
     * CRUD
     * ************
     */

    create(item){
        return this._model.create(item, {raw: true});
    }

    read(item = {}){
        return this._model.findAll({where: item, raw: true});
    }

    update(id, item, upsert=false, username=false){
        const fn = (upsert) ? 'upsert' : 'update'; // Se não existir, insere, se existir, atualiza
        
        if(!username){ 
            return this._model[fn](item, { where: { id }});

        } else {
            return this._model.update(item, { where: { username }});
        }

    }

    delete(id){
        const query = (id) ? { id } : {} // se (id) foi passado, retorna um objeto contendo {id}, se não retorna objeto vazio {}
        return this._model.destroy({where: query});
    }
}

module.exports = Postgres;