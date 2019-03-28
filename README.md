# this repo is for testing full text search performance in postgresql

refer to this nice article

https://austingwalters.com/fast-full-text-search-in-postgresql/

## Run postgre database and db web gui (adminer) by docker-compose

`docker-compose up -d`

go to `http://localhost:8081` and username,pwd all are `exmaple`

connect to postgresql db by `postgres://example:example@127.0.0.1:8082/testdb` or `postgres://example:example@127.0.0.1:8082/postgres`

###

checkout queries.sql and go to adminer web gui for testing
