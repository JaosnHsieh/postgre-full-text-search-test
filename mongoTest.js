// getting-started.js
const mongoose = require('mongoose');
(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27019/testdb', {
      useNewUrlParser: true,
    });

    const CommentSchema = new mongoose.Schema({
      story_url: String,
      story_title: String,
      comment_text: String,
    });

    const Comment = mongoose.model('Comment', Comment);
    await addComments(Comment);
  } catch (err) {
    console.error(err);
  }
})();

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
  }
  console.log('inserting Comments', i * batchNumber);
  await Promise.all(batchCreate);
}
