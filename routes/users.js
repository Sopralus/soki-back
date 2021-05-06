var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const middleware = require('../middleware.js');


// POST check auth to login
router.post('/auth', async(req, res, next) => {
  const { username, password } = req.body;
  const user = await mongoose.model('User').findOne({
    username,
    password
  })

  if (user) {
    res.json({
      success: true,
      message: 'Authentication successful!',
      // token: token,
      toker: user._id
    });
  } else {
    res.send(403).json({
      success: false,
      message: 'Login failed'
    });
  } 
})

/* GET users listing. */
router.get('/', async(req, res, next) => {
  res.json(await mongoose.model('User').find({}));
});

/* create one user. */
router.post('/', async(req, res, next) => {
  res.json(await mongoose.model('User').create(req.body));
});

// /* GET one user from streamkey. */
// router.post('/:streamkey', async(req, res, next) => {
//   res.json(await mongoose.model('User').findOne(req.params.streamkey));
// });


/* Update one user. */
router.put('/:id', async(req, res, next) => {
  res.json(await mongoose.model('User').findByIdAndUpdate(req.params.id, req.body));
});

/* DELETE one uner. */
router.delete('/:id', async(req, res, next) => {
  res.json(await mongoose.model('User').findByIdAndRemove(req.params.id));
});

/* GET one user. */
router.get('/:id', async(req, res, next) => {
  res.json(await mongoose.model('User').findById(req.params.id));
});


module.exports = router;