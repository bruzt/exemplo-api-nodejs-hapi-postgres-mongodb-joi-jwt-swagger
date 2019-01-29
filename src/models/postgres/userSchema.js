const Sequelize = require('sequelize');

const userSchema = {
    name: 'TB_USERS',
    schema: {
        id: {
            type: Sequelize.INTEGER, // ID INT
            require: true, // NOT NULL
            primaryKey: true, // PRIMARY KEY
            autoIncrement: true // GENERATED ALWAYS AS IDENTITY
        },
        username: {
            type: Sequelize.STRING, // NAME TEXT
            require: true, // NOT NULL
            unique: true
        },
        password: {
            type: Sequelize.STRING, // POWER TEXT
            require: true // NOT NULL
        }
    },
    options: {
        tableName: 'TB_USERS', // nome da tabela
        freezeTableName: true, // não altera o nome da tabela
        timestamps: false // cria capos createdAt e updatedAt
    }
};

module.exports = userSchema;