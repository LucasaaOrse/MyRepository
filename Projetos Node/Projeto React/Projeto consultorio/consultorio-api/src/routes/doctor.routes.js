const express = require('express')
const router = express.Router()
const DoctorController = require('../controllers/doctorController')
const authenticate = require('../middleware/authenticate')


router.post('/associete', DoctorController.associatespecialtydoctor)
router.get('/specialties/:id/medicos', DoctorController.doctorByspecialty)
router.get('/doctors', DoctorController.listAllDoctors)
router.post('/doctors/schedules', authenticate, (req, res, next) => {
  if(req.user.type !== 'admin'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, DoctorController.setDoctorSchedules)

router.get('/doctor/schedule/:doctor_id', authenticate, DoctorController.getscheduleByDoctorId)

module.exports = router