# http://localhost:5000/documentation

# Default username and password
```
{
  "username": "admin",
  "password": "admin"
}
```

# Cria a bridge network
sudo docker network create api-bridge

# Container MongoDB
```
sudo docker run -d \
    --name mongodb-test \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
    --network=api-bridge \
    -p 27017:27017 \
    mongo:4.0.5
```

# Container Postgres
```
sudo docker run -d \
    --name postgres-test \
    -e POSTGRES_USER=cliente1 \
    -e POSTGRES_PASSWORD=123 \
    -e POSTGRES_DB=users \
    --network=api-bridge \
    -p 5432:5432 \
    postgres:11.1
```

# Cria User e DB no MongoDB
```
sudo docker exec -ti mongodb-test \
    mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('peoples').createUser({user: 'cliente1', pwd: '123', roles: [{role: 'readWrite', db: 'peoples'}]})"
```

# Testa a API em dev mode
```
npm run test
```

# Testa a API em prod mode
```
npm run test:prod
```

# Executa a API em prod mode
```
npm run prod
```

################################

# Container API-test
```
sudo docker run -d \
	--name api-test \
	-p 5000:5000 \
	--network=api-bridge \
    bruzt/api-rest-hapi:1.0.2
```


################################

# Postgres log-in pelo terminal
```
sudo docker exec -ti postgres \
      psql -U cliente1 -d peoples -h localhost
```

# MongoDB log-in pelo terminal
```
sudo docker exec -it mongodb \
    mongo -u cliente1 -p 123 --authenticationDatabase peoples
```
