// this is a full text search test refer to this below article
// https://austingwalters.com/fast-full-text-search-in-postgresql/
const connectionString = `postgres://example:example@127.0.0.1:8082/testdb`;
const Sequelize = require('sequelize');

(async () => {
  try {
    // await createTestDB();
    // await dropTestDB();
    const sequelize = new Sequelize(connectionString);
    class Comment extends Sequelize.Model {}
    Comment.init(
      {
        story_url: Sequelize.STRING,
        story_title: Sequelize.STRING,
        comment_text: Sequelize.STRING(2000),
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      { sequelize },
    );
    await sequelize.sync();
    await addComments(Comment);
  } catch (err) {
    console.error(err);
  }
})();

async function createTestDB() {
  try {
    const connectionString = `postgres://example:example@127.0.0.1:8082/postgres`;
    const { Client } = require('pg');
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query('CREATE DATABASE testdb');
    console.log('database testdb created');
    await client.end();
  } catch (err) {
    console.error(err.message);
  }
}

async function dropTestDB() {
  try {
    const connectionString = `postgres://example:example@127.0.0.1:8082/postgres`;
    const { Client } = require('pg');
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query('DROP DATABASE testdb');
    console.log('database testdb dropped');
    await client.end();
  } catch (err) {
    console.error(err.message);
  }
}

async function addComments(Comment, number = 1000000) {
  const faker = require('faker');
  const batchNumber = 1000;
  for (let i = 0; i < number / batchNumber; ++i) {
    const batchCreate = Array.from({ length: batchNumber }).map(_ =>
      Comment.create({
        story_url: faker.internet.url(),
        story_title: faker.lorem.words(),
        comment_text: faker.lorem.paragraphs(),
      }),
    );
    console.log('inserting Comments', i * batchNumber);
    await Promise.all(batchCreate);
  }
}
