const assert = require('assert');

const PasswordHelper = require('../controllers/helpers/PasswordHelper');


const PASSWD = '0123';
let HASH;
describe ('PasswordHelper Test Suite', () => {
    before(async () => {
        HASH = await PasswordHelper.hashPassword(PASSWD);
    });

    it ('Deve gerar um hash a partir de uma senha', async () => {
        const response = await PasswordHelper.hashPassword(PASSWD);
        
        assert.ok(response.length > 10);
    });

    it ('Deve comparar uma senha com seu hash', async () => {
        const response = PasswordHelper.comparePassword(PASSWD, HASH);

        assert.ok(response);
    });
});