const fs = require('fs');

// Fetching tours from JSON file.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Creating Param middleware that will check tour id, so we don't have to check it in every function

exports.checkID = (req, res, next, val) => {
  if (val >= tours.length) {
    return res.status(404).json({
      status: 'Failed!',
      message: 'Invalid Id'
    });
  }

  next();
}

// Create a checkBody middleware 
// check if body contains the name and price property
// if not, sent back 400 (bad request)
// add it to the post handler stack
exports.validateBody = (req, res, next) => {
  if (req.body.name && req.body.price) {
    next();
  }

  return res.status(400).json({
    status: 'failed',
    message: 'Missing name or price!',
    data: []
  });
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;  

  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
}

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
}