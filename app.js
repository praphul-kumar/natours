const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

// Creating an express app
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Creating our owm Middleware

// In Express Order of middleware matters because express handles middleware in a FIFS manner.

app.use((req, res, next) => {
  console.log('Hello from moddleware 👋');

  next();
});

// Creating another middleware to manupulate req object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Fetching tours from JSON file.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// Route Handlers

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;

  if (id >= tours.length) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid Id'
    });
  }

  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}

const createTour = (req, res) => {
  // console.log(req.body); 

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) console.log(err.message);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
}

const updateTour = (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}

// Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Another way to define routes
app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);


// Starting Server

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

