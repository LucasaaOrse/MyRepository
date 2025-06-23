const express =  require('express')
const router = express.Router()
const SpecialtiesController = require('../controllers/SpecialtiesController')


router.get('/specialties', SpecialtiesController.getSpecialties)


module.exports = router