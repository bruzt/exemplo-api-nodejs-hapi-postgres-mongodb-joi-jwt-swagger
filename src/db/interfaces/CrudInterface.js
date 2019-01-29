class NotImplementedException extends Error {
    constructor(){
        super("Método não implementado");
    }
}

class CrudInterface {
    create(item){
        throw new NotImplementedException();
    }

    read(query){
        throw new NotImplementedException();
    }

    update(id, item){
        throw new NotImplementedException();
    }

    delete(id){
        throw new NotImplementedException();
    }

    isConnected(){
        throw new NotImplementedException();
    }
    _connect(){
        throw new NotImplementedException();
    }
}

module.exports = CrudInterface;