const express = require('express')
const router = express.Router()
const AppointmentController = require('../controllers/AppointmentController')
const authenticate = require('../middleware/authenticate')

router.post('/appointments', authenticate,  AppointmentController.createappointment)
router.get('/appointments/clients', authenticate, (req, res, next) => {
  console.log("Tipo do usuário:", req.user.type, typeof req.user.type)
  if(req.user.type !== 'client'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.getappointmentsForclients)
router.get('/appointments/doctors', authenticate, (req, res, next) => {
  if(req.user.type !== 'medico'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.getDoctorAppointments)
router.get('/appointments/admin', authenticate, (req, res, next) => {
  if(req.user.type !== 'admin'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.getAppointmentsForAdmin)


router.delete('/appointment/client/:id', authenticate, (req, res, next) => {
  if(req.user.type !== 'client'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.canceledAppointmentClient )

router.delete('/appointment/admin/:id', authenticate, (req, res, next) => {
  if(req.user.type !== 'admin'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.canceledAppointmentAdmin)

router.patch('/appointment/complete/:id', authenticate, (req, res, next) => {
  if(req.user.type !== 'medico'){
    return res.status(403).json({error: "Acesso negado."})
  }
  next()
}, AppointmentController.concludeAppointment)

router.delete('/appointments', AppointmentController.deleteAppointments)

router.get('/appointments/doctor/:doctor_id', AppointmentController.getDoctorAppointmentsForClients);

router.get('/appointments/occupied-slots/doctor/:id', AppointmentController.getOccupiedSlots)

router.get('/appointments', AppointmentController.allappointments)
module.exports = router