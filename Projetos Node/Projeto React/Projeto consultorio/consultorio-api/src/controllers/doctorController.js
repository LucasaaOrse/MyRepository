const db = require('../database/connection')

module.exports = {
  async associatespecialtydoctor(req, res){
    const { doctor_id, specialty_id } = req.body

    const doctorExist = await db('users').where({id: doctor_id}).first()

    if(doctorExist){

      const specialityExist = await db('specialties').where({id: specialty_id}).first()

      if(specialityExist){

        await db('doctor_specialties').insert({doctor_id: doctor_id, specialty_id: specialty_id})
        return res.status(200).json({message: `${specialityExist.name} associada ao Doutor(a) ${doctorExist.name} `})
      }else{
        return res.status(404).json({error: "Especialidade não encontrada", details: error.message})
      }

    }else{
      return res.status(404).json({error: "Doutor não encontrado", details: error.message})
    }

  },
  async doctorByspecialty(req, res){
    const { id } = req.params

    try {
      
      const doutors = await db('doctor_specialties')
      .join('users', 'users.id', 'doctor_specialties.doctor_id')
      .where('doctor_specialties.specialty_id', id)
      .select('users.id', 'users.name', 'users.email')

      return res.json(doutors)
    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  },
  async setDoctorSchedules(req, res){
    const { id, schedules } = req.body

    if(!Array.isArray(schedules) || schedules.length === 0){
      return res.status(400).json({error: "Envie pelo menos um dia de atendimento"})
    }

    try {
      
      await db('doctor_schedules').where({doctor_id: id}).del()

      const formatted = schedules.map(({ weekday, start_time, end_time }) => ({
        doctor_id: id,
        weekday,
        start_time,
        end_time
      }));

      await db('doctor_schedules').insert(formatted)

      return res.status(201).json({message: "Agenda cadastrada com sucesso"})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }

  },
  async listAllDoctors(req, res){

    try {
      
      const doctors = await db('users').where('type', "medico").select("id", "name", "email", "created_at", "updated_at")
      return res.status(200).json(doctors)

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }

  },
  async getscheduleByDoctorId(req, res){
    const doctor_id = req.params.doctor_id

    try {

      const schedule = await db('doctor_schedules').where({doctor_id}).select("*")
      return res.status(200).json(schedule)
    
    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  }
}
