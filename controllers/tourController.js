const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
  if (val * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id'
    })
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failure',
      message: 'Missing Name Or Price'
    })
  }
  next()
}

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours
    }
  })
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "success",
      data: {
        tours
      }
    })
  })
};

exports.updateTour = (req, res) => {
  //The Logic is not completed
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: 'Updated Tours Here'
    }
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null
  })
}

exports.searchTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => {
    return el.id === id
  })
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
};