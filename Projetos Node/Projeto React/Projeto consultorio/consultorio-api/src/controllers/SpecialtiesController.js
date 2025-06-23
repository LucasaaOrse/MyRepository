const db = require('../database/connection')

module.exports = {
    async getSpecialties(req, res){
        try {
            const specialties = await db('specialties').select('*')
            return res.json(specialties)
        } catch (error) {
            return res.status(500).json({error: "Erro do servidor", details: error.message})
        }
    }

}