var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// router.post('/auth', (req, res, next) => {
//   const { username, password } = req.body;
//   const user = await mongoose.model('User').findOne({
//     username,
//     password
//   })

//   if(user) {
//     res.json({ toker: user._id })
//   } else {
//     res.status(401)
//     res.json({ message: "login failed" });
//   }
// })

/* GET users listing. */
router.get('/', async(req, res, next) => {
  res.json(await mongoose.model('User').find({}));
});

/* create one user. */
router.post('/', async(req, res, next) => {
  res.json(await mongoose.model('User').create(req.body));
});

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
