const assert = require('assert');

const Postgres = require('./../db/Postgres');
const PeopleSchema = require('../models/postgres/peopleSchema');


const REGISTER_PERSON = {
    name: 'José da Silva',
    age: '31'
}

const MOCK_UPDATE_PERSON = {
    name: 'Barbra Gordon',
    age: '25'
}

let postgres = {};

describe ('Postgres Test Suite', () => {
    before(async () => {    
        postgres = new Postgres(PeopleSchema);
        
        await postgres.create(MOCK_UPDATE_PERSON);
    });

    after(async () => {
        await postgres.delete(null, all=true); // limpa a base de dados
    });

    it('Verificar conexão com Postgres', async () => {
        const result = await postgres.isConnected();
        assert.deepStrictEqual(result, true);
    });

    it('Cadastrar no postgres', async () => {
        const result = await postgres.create(REGISTER_PERSON);
        
        delete result.id;
        const { name, age } = result;

        assert.deepStrictEqual({ name, age }, REGISTER_PERSON);
    });

    it("Listar no postgres", async () => {
        const [result] = await postgres.read({name: REGISTER_PERSON.name}); // [result] = result[0]
        
        // delete result.id;
        const { name, age } = result;

        assert.deepStrictEqual({ name, age }, REGISTER_PERSON);
    });

    it("Atualizar no postgres", async () => {
        const [updateItem] = await postgres.read({name: MOCK_UPDATE_PERSON.name});
        
        const newItem = {
            ...MOCK_UPDATE_PERSON, // divide todas as chaves de MOCK_UPDATE_PERSON dentro do newItem
            name: 'Barbara'
        }
        
        const [result] = await postgres.update(updateItem.id, newItem);
        assert.deepStrictEqual(result, 1);
    });

    it("Remover no postgres", async () => {
        const [item] = await postgres.read({});
        const result = await postgres.delete(item.id);

        assert.deepStrictEqual(result, 1);

    });
});