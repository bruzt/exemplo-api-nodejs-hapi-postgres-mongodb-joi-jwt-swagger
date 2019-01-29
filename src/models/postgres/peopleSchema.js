const Sequelize = require('sequelize');

const peopleSchema = {
    name: 'TB_PEOPLES',
    schema: {
        id: {
            type: Sequelize.INTEGER, // ID INT
            require: true, // NOT NULL
            primaryKey: true, // PRIMARY KEY
            autoIncrement: true // GENERATED ALWAYS AS IDENTITY
        },
        name: {
            type: Sequelize.STRING, // NAME TEXT
            require: true // NOT NULL
        },
        age: {
            type: Sequelize.STRING, // AGE TEXT
            require: true // NOT NULL
        }
    },
    options: {
        tableName: 'TB_PEOPLES', // nome da tabela
        freezeTableName: true, // não altera o nome da tabela
        timestamps: true // cria capos createdAt e updatedAt
    }
};

module.exports = peopleSchema;
