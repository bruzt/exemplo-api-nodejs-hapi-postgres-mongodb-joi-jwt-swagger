const assert = require('assert');

const MongoDB = require('./../db/MongoDB');
const PeopleSchema = require('../models/mongodb/peopleSchema')


const REGISTER_PERSON = {
    name: 'João da Silva',
    age: '30'
}

const UPDATE_PERSON = {
    name: 'Maria Joaquina',
    age: '29'
}

let ID = null, ids = [];

describe ("MongoDB Test Suite", () => {
    before (async () => {
        mongodb = new MongoDB(PeopleSchema);
        
        const result = await mongodb.create(UPDATE_PERSON);
        ID = result._id;

        ids.push(result._id);
    });

    after(() => {
        ids.map(async (id) => {
            await mongodb.delete(id);
        });
    });

    it ('verificar conexão com mongoDB', async () => {
        const result = await mongodb.isConnected();

        assert.deepStrictEqual(result, 1);
    });

    it ("Cadastrar no Mongodb", async () => {
        const { _id, name, age } = await mongodb.create(REGISTER_PERSON); // { name, power } = destructor, retorna apenas os valores das chaves

        ids.push(_id);

        assert.deepStrictEqual({ name, age }, REGISTER_PERSON); 
    });
    it("Listar no mongoDB", async () => {
        const [{ name, age }] = await mongodb.read({name: REGISTER_PERSON.name}); // [{name, power}] = retorna primeira posição + destructor

        assert.deepEqual({name, age }, REGISTER_PERSON);
    });

    it("Atualizar no mongoDB", async () => {
        const result = await mongodb.update(ID, { name: 'Feiticeira' });
        
        assert.deepStrictEqual(result.nModified, 1);
    });

    it("Deletar no mongodb", async () => {
        const result = await mongodb.delete(ID);

        assert.deepStrictEqual(result.n, 1);
    });


});