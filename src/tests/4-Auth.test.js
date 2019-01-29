const assert = require('assert');

const api = require('../api');
const Postgres = require('../db/Postgres');
const userSchema = require('../models/postgres/userSchema');
const PasswordHelper = require('../controllers/helpers/PasswordHelper');


const CREATE_ADMIN_USER = {
    username: "admin",
    password: "admin"
};

let app = {};
describe ("Authentication Test Suite", () => {
    before (async () => {
        app = await api;

        const postgres = new Postgres(userSchema);

        const USER_DB = {
            username: CREATE_ADMIN_USER.username.toLowerCase(),
            password: await PasswordHelper.hashPassword(CREATE_ADMIN_USER.password)
        }

        await postgres.update(null, USER_DB, true);
        
    });

    it ('Deve obter um token', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login/token',
            payload: CREATE_ADMIN_USER
        });

        assert.ok(response.statusCode === 200);
        assert.ok(JSON.parse(response.payload).token.length > 10);
    });

    it('Deve retornar "não autorizado" ao tentar login invalido', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/login/token',
            payload: {
                username: 'arul',
                password: '123'
            }
        });

        assert.ok(response.statusCode === 401);
        assert.ok(JSON.parse(response.payload).error === "Unauthorized");
    });

});