const assert = require('assert');

const api = require('../api');
const MongoDB = require('./../db/MongoDB');
const PeopleSchema = require('../models/mongodb/peopleSchema')


const DEFAULT_REGISTER = {
    name: 'Chapolin Colorado',
    age: '28'
};

const PERSON_UPDATE = {
    name: 'Luke Skywalker',
    age: '27'
};

const USER_LOGIN = {
    username: 'admin',
    password: 'admin'
};

let app, ID, wrongID, reply, headers, ids = [];
describe ("API Test Suite", () => {
    before (async () => {
        app = await api;
        mongodb = new MongoDB(PeopleSchema);

        const TOKEN = await app.inject({ // gera um token para fazer os testes
            method: 'POST',
            url: '/login/token',
            payload: JSON.stringify(USER_LOGIN)
        });

        headers = {
            authorization: TOKEN.result.token
        }

        reply = await mongodb.create(PERSON_UPDATE);
        ids.push(reply._id);
        ID = reply._id;
        wrongID = `${ID}01`;

        reply = await mongodb.create(PERSON_UPDATE);
        ids.push(reply._id);
        
    });

    after(async () => {
        for(let i=0; i<=ids.length-1; i++){
            //console.log(ids[i])
            await mongodb.delete(ids[i]);
        }
    });

    it('Deve acessar raiz "/" e retornar mensagem', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/',
        });
        //console.log(response)
        assert.deepStrictEqual(response.payload, '<h1>Acesse /documentation</h1>')
    })

    it ('Listar /people', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/people/read',
            headers
        });
        
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });

    it('Listar /people - (limit) deve limitar em 2 registros', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/people/read?limit=2',
            headers
        });

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(data.length  === 2);
    });

    it('Listar /people - (skip) deve pular os 5 primeiros registros', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/people/read?skip=5',
            headers
        });

        const fiveFirst = await app.inject({
            method: 'GET',
            url: '/people/read?limit=5',
            headers
        });

        const statusCode = result.statusCode;
        const fiveFirststatusCode = result.statusCode;

        assert.deepStrictEqual(statusCode, 200);
        assert.deepStrictEqual(fiveFirststatusCode, 200);
        assert.ok(result.payload !== fiveFirst.payload);
    });

    it('Listar /people - Deve retornar erro ao passar tipo incorreto', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/people/read?skip=Z',
            headers
        });

        const errorCode = { statusCode: 400,
            error: 'Bad Request',
            message: 'child "skip" fails because ["skip" must be a number]',
            validation: { source: 'query', keys: [ 'skip' ] } }

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        
        assert.deepStrictEqual(statusCode, 400);
        assert.deepStrictEqual(data, errorCode);
    });

    it('Listar /people - deve filtrar pelo nome', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/people/read?name=Luke',
            headers
        });

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(data[0].name  === 'Luke Skywalker');
    });

    it('Listar /people pelo ID', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/people/read/${ID}`,
            headers
        });

        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        
        assert.deepStrictEqual(statusCode, 200);
        assert.ok(data[0].name  === 'Luke Skywalker');
    });

    it('Cadastrar /people - POST', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/people/create',
            headers,
            payload: JSON.stringify(DEFAULT_REGISTER)
        });
        
        const statusCode = result.statusCode;
        

        const { message, _id: id } = JSON.parse(result.payload);

        ids.push(id);

        assert.ok(statusCode === 200);
        assert.notDeepStrictEqual(id, undefined);
        assert.deepEqual(message, "Pessoa cadastrada com sucesso");
    });

    it('Atualizar PATCH - /people/:id', async () => { // PATCH -> atualização parcial, PUT -> atualização de todos os campos
        const expected = {
            age: '26'
        };
        
        const response = await app.inject({
            method: 'PATCH',
            url: `/people/update/${ID}`,
            headers,
            payload: JSON.stringify(expected)
        });

        const iddata = response.result.id;
        //console.log(iddata)
        //console.log(ID)

        //assert.deepStrictEqual(iddata, ID);
        assert.deepStrictEqual(response.result.message, 'Pessoa atualizada com sucesso');
        assert.ok(response.statusCode === 200);
    });

    it('Atualizar PATCH - ID Incorreto', async () => {
        const expected = {
            age: '26'
        };

        const response = await app.inject({
            method: 'PATCH',
            url: `/people/update/${wrongID}`,
            headers,
            payload: JSON.stringify(expected)
        });
        
        assert.deepStrictEqual(response.result.message, 'ID não encontrado no DB');
        assert.ok(response.statusCode === 412);
    });

    it('Deletar DELETE - /people/:id', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/people/delete/${ID}`,
            headers
        });

        //const iddata = response.result.id;

        //assert.deepStrictEqual(iddata, ID);
        assert.ok(response.statusCode === 200);
        assert.deepStrictEqual(response.result.message, 'Pessoa deletada com sucesso');
        
    });

    it('Deletar DELETE - ID Incorreto', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/people/delete/${wrongID}`,
            headers
        });
        
        assert.ok(response.statusCode === 412);
        assert.deepStrictEqual(response.result.message, 'ID não encontrado no DB');
    });
});

