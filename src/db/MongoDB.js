const CrudInterface = require('./interfaces/CrudInterface');
const Mongoose = require('mongoose');


class MongoDB extends CrudInterface {
    constructor(scheme) {
        super();
        this._schema = scheme;
        this._connection = null;
        this._connect();
    }

    _connect() {
        Mongoose.connect(process.env.MONGODB_URL, // 'mongodb://user:passwd@host:port/dbname'
            { useNewUrlParser: true },
            (error) => {
                if (!error) return;
                console.log("Erro na conexão", error);
            }
        );
        const connection = Mongoose.connection;

        //connection.once('open', () => console.log("MongoDB rodando!"));
        this._connection = connection;  
    }

    async isConnected() {

        // 0=disconectado, 1=conectado, 2=conectando, 3=disconectando
        while(this._connection.readyState === 2){
            await new Promise((resolve) => setTimeout(resolve, 1));
        }

        if (this._connection.readyState === 1) return 1;
        
        return this._connection.readyState;
    }

    /**
     * ****************
     * CRUD
     * ****************
     */

    create(item) {
        return this._schema.create(item);
    }

    read(item, skip=0, limit=10) {
        return this._schema.find(item).skip(skip).limit(limit); // skip ignora os primeiros do numero passado, limit limita o quantidade de retorno do find
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item });
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id });

        //return this._schema.deleteMany({});
    }
}

module.exports = MongoDB;