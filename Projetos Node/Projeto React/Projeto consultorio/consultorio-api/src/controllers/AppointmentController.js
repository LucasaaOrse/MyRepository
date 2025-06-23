const db = require('../database/connection')
const Joi = require('joi');
const applyAppointmentFilters = require('./utils/applyAppointmentFilters')

const appointmentSchema = Joi.object({
  doctor_id: Joi.number().integer().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Data deve estar no formato YYYY-MM-DD',
    }),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Horário deve estar no formato HH:MM',
    }),
});

function weekdayFromDate(date) {
  return new Date(date).getUTCDay(); // <- CORRETO
}

module.exports = {
  async createappointment(req, res) {
    const { doctor_id, date, time } = req.body;
    const client_id = req.user?.id;

    const { error } = appointmentSchema.validate({ doctor_id, date, time });
    if (error) {
      return res.status(400).json({ error: "Dados inválidos", details: error.message });
    }

    try {
      const appointmentDateTime = new Date(`${date}T${time}`);
      const now = new Date();

      if (appointmentDateTime <= now) {
        return res.status(400).json({ error: "Não é possível agendar uma consulta no passado." });
      }

      const weekday = weekdayFromDate(date); // 0 (domingo) a 6 (sábado)

      console.log("Data informada:", date);
      console.log("Dia da semana calculado:", weekday);

      // Verifica se o médico atende no dia escolhido (verificando a agenda do médico)
      const schedule = await db("doctor_schedules")
        .where({ doctor_id })
        .andWhere('weekday', weekday)  // Verifica se o dia escolhido está na agenda
        .first();
        console.log("Resultado da busca no banco:", schedule);
      if (!schedule) {
        return res.status(400).json({ error: "O médico não atende nesse dia da semana." });
      }

      const { start_time, end_time } = schedule;

      // Verifica se o horário escolhido está dentro do período de atendimento
      if (time < start_time || time > end_time) {
        return res.status(400).json({
          error: `Horário fora do período de atendimento. Horários válidos: ${start_time} às ${end_time}.`
        });
      }

      // Verifica se já existe uma consulta para esse médico, data e horário
      const existingAppointment = await db("appointments")
        .where({ doctor_id, date, time })
        .first();

      if (existingAppointment) {
        return res.status(409).json({ error: "Horário já está reservado. Escolha outro." });
      }

      // Insere nova consulta
      await db("appointments").insert({
        doctor_id,
        client_id,
        date,
        time
      });

      return res.status(201).json({ message: "Consulta marcada com sucesso." });
    } catch (error) {
      return res.status(500).json({
        error: "Erro do servidor",
        details: error.message
      });
    }
  },
  async getappointmentsForclients(req, res) {
    const client_id = req.user.id;
  
    try {
      let query = db('appointments')
        .where('appointments.client_id', client_id)
        .join('users as doctors', 'appointments.doctor_id', 'doctors.id')
        .join('doctor_specialties', 'doctors.id', 'doctor_specialties.doctor_id')
        .join('specialties', 'doctor_specialties.specialty_id', 'specialties.id')
        .select(
          'appointments.id',
          'appointments.date',
          'appointments.time',
          'appointments.status',
          'doctors.name as doctor_name',
          'specialties.name as specialty'
        );
  
      query = applyAppointmentFilters(query, req.query);
  
      const appointmentList = await query;
  
      return res.status(200).json(appointmentList);
  
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },
  async getDoctorAppointments(req, res) {
    const doctor_id = req.user.id;
  
    try {
      let query = db('appointments')
        .where('appointments.doctor_id', doctor_id)
        .join('users as clients', 'appointments.client_id', 'clients.id')
        .join('doctor_specialties', 'appointments.doctor_id', 'doctor_specialties.doctor_id')
        .join('specialties', 'doctor_specialties.specialty_id', 'specialties.id')
        .select(
          'appointments.id',
          'appointments.date',
          'appointments.time',
          'appointments.status',
          'appointments.canceled_at',
          'appointments.canceled_by',
          'clients.name as client_name',
          'specialties.name as specialty'
        );
  
      query = applyAppointmentFilters(query, req.query);
  
      const appointmentList = await query;
  
      return res.status(200).json({ appointmentList });
  
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },
  async getAppointmentsForAdmin(req, res) {
    try {
      let query =  db('appointments')
        .join('users as doctors', 'appointments.doctor_id', 'doctors.id')
        .join('users as clients', 'appointments.client_id', 'clients.id')
        .join('doctor_specialties', 'appointments.doctor_id', 'doctor_specialties.doctor_id')
        .join('specialties', 'doctor_specialties.specialty_id', 'specialties.id')
        .select(
          'appointments.id',
          'appointments.date',
          'appointments.time',
          'appointments.status',
          'appointments.canceled_at',
          // ou para admin
          'clients.name as client_name',
          'doctors.name as doctor_name',
          'specialties.name as specialty'
        )

        query = applyAppointmentFilters(query, req.query)

        const appointmentList = await query
  
      return res.status(200).json({ appointmentList });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },
  async canceledAppointmentClient(req, res){
    const appointment_id = req.params.id;
    const client = req.user

    const appointment = await db('appointments').where({id: appointment_id}).first()

    if(!appointment){
      return res.status(404).json({error: "Consulta não encontrada"})
    }

    if(appointment.client_id !== client.id){
      return res.status(400).json({error: "Consulta invalida"})
    }

    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`)
    const now = new Date()
    console.log(appointmentDateTime, now)

    const diffMs = appointmentDateTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    if(diffHours < 24){
      return res.status(400).json({error: "A consulta só pode ser cancelada com no mínimo 1 dia de antecedência."})
    }

    try {
      
      await db('appointments')
        .where({ id: appointment_id })
        .update({
          status: 'canceled',
          canceled_at: new Date(),
          canceled_by: client.name
        });
      return res.status(200).json({message: `Consulta ${appointment_id} cancelada com sucesso`})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})      
    }
    
  },
  async canceledAppointmentAdmin (req, res) {
    const appointment_id = req.params.id;
    const client = req.user
    const appointment = await db('appointments').where({id: appointment_id}).first()

    if(!appointment){
      return res.status(404).json({error: "Consulta não encontrada"})
    }
    try {
      
      await db('appointments')
        .where({ id: appointment_id })
        .update({
          status: 'canceled',
          canceled_at: new Date(),
          canceled_by: client.name
        });
      return res.status(200).json({message: `Consulta ${appointment_id} cancelada com sucesso`})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})      
    }

  },
  async concludeAppointment(req, res){
    const appointment_id = req.params.id
    const user = req.user

    const appointmentExist = await db('appointments').where({id: appointment_id}).first()

    if(!appointmentExist){
      return res.status(404).json({error: "Consulta não encontrada"})
    }

    if(appointmentExist.doctor_id !== user.id){
      return res.status(400).json({error: "Usuario invalido"})
    }

    if(appointmentExist.status !== "ativa"){
      return res.status(400).json({error: "Essa consulta não esta ativa ou já foi cancelada"})
    }

    const now = Date.now()
    const appointmentDateTime = new Date(`${appointmentExist.date}T${appointmentExist.time}`);

    if(appointmentDateTime > now){
      res.status(400).json({error: "A consulta ainda não ocorreu para ser concluída."})
    }

    try {
      
      await db('appointments').where({id: appointment_id}).update("status", 'done')
      return res.status(200).json({message: "Consulta concluida com sucesso"})
    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  },
  async deleteAppointments(req, res) {
    const { ids } = req.body;               // espera { ids: [1,2,3] }
  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Envie um array de ids para deletar" });
    }
  
    try {
      await db('appointments')
        .whereIn('id', ids)                // deleta todos cujos id estão em ids
        .del();
  
      return res.status(200).json({ message: "Consultas deletadas com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },
  async getDoctorAppointmentsForClients(req, res) {
    const { doctor_id } = req.params;  // Agora acessa o ID do doutor via URL
  
    try {
      let query = db('appointments')
        .where('appointments.doctor_id', doctor_id)
        .join('users as clients', 'appointments.client_id', 'clients.id')
        .join('doctor_specialties', 'appointments.doctor_id', 'doctor_specialties.doctor_id')
        .join('specialties', 'doctor_specialties.specialty_id', 'specialties.id')
        .select(
          'appointments.id',
          'appointments.date',
          'appointments.time',
          'appointments.status',
          'appointments.canceled_at',
          'appointments.canceled_by',
          'clients.name as client_name',
          'specialties.name as specialty'
        );
  
      query = applyAppointmentFilters(query, req.query);
  
      const appointmentList = await query;
  
      return res.status(200).json({ appointmentList });
  
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
},
async getOccupiedSlots(req, res) {
  const doctorId = req.params.id;
  const date = req.query.date; // A data será passada como query
  
  try {
    // Verifica se a data foi passada
    if (!date) {
      return res.status(400).json({ error: "Data não fornecida." });
    }

    // Busca as consultas do doutor para a data específica
    const occupiedDatesQuery = await db('appointments')
      .where('doctor_id', doctorId)
      .andWhere('date', date)
      .whereNotNull('time')  // Verifica se o campo 'time' não é nulo
      .select('date', 'time')
      .orderBy('time', 'asc');
    
    // Verifica se encontrou alguma consulta
    if (occupiedDatesQuery.length === 0) {
      return res.status(200).json({ message: 'Nenhuma consulta ocupada para essa data.' });
    }

    // Organiza os horários ocupados por data
    const occupiedSlots = occupiedDatesQuery.map(item => ({
      date: item.date,
      time: item.time
    }));

    return res.status(200).json({ occupiedSlots });

  } catch (error) {
    return res.status(500).json({ error: 'Erro do servidor', details: error.message });
  }
},

  async allappointments(req, res){

    try {
      
      const resposta = await db('appointments').select('*')
      return res.json(resposta)

    } catch (error) {
      return res.status(500).json({error: "erro do servidor", details: error.message})
    }

  }

}


