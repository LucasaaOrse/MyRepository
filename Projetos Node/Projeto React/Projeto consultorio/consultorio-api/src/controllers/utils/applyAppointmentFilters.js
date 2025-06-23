function applyAppointmentFilters(query, filters) {
  const {
    date,
    past,
    future,
    status,
    doctor_id,
    specialty,
  } = filters;

  const now = new Date();

  // Filtro por data específica
  if (date) {
    query.where('appointments.date', date);
  }

  // Filtro por consultas passadas
  if (past === 'true') {
    query.whereRaw("CAST(appointments.date || ' ' || appointments.time AS timestamp) < ?", [now]);
  }

  // Filtro por consultas futuras
  if (future === 'true') {
    query.whereRaw("CAST(appointments.date || ' ' || appointments.time AS timestamp) > ?", [now]);
  }

  // Filtro por status (active, canceled, done)
  if (status) {
    query.where('appointments.status', status);
  }

  // Filtro por médico
  if (doctor_id) {
    query.where('appointments.doctor_id', doctor_id);
  }

  // Filtro por especialidade
  if (specialty) {
    query.whereILike('specialties.name', `%${specialty}%`);
  }

  // Paginação

  return query;
}
module.exports = applyAppointmentFilters;