const Mongoose = require('mongoose'); 

const peopleSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    }
},{
    timestamps: true // cria createAt e updateAt
});

module.exports = Mongoose.model('cl_peoples', peopleSchema);