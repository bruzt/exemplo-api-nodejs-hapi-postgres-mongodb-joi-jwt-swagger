const Bcrypt = require('bcrypt');
const { promisify } = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);

const SALT = parseInt(process.env.SALT_PASSWD);

class PasswordHelper {

    static hashPassword (passwd){
        return hashAsync(passwd, SALT);
    } 

    static comparePassword(passwd, hash){
        return compareAsync(passwd, hash);
    }
}

module.exports = PasswordHelper;