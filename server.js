require('dotenv').config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

// const DB_URL = process.env.MONGO_URL.replace(
//   '<password>',
//   process.env.MONGO_PASSWORD,
// );

const DB_URL = process.env.MONGO_LOCAL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB!!');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'Tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
