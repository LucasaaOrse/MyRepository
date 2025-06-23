exports.seed = async function(knex) {
    // Apaga todos os registros existentes
    await knex('specialties').del();
  
    // Insere dados iniciais
    await knex('specialties').insert([
      { name: 'Cardiologia' },
      { name: 'Pediatria' },
      { name: 'Dermatologia' },
      { name: 'Ortopedia' },
      { name: 'Ginecologia' },
      { name: 'Neurologia' }
    ]);
  };
  