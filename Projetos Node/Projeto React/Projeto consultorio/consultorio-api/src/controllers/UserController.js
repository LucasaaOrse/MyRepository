const db = require('../database/connection')
const bcrypt = require("bcryptjs")
const saltrounds = 10
const { findUserByEmail, findUserById } = require('./utils/utils')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const Joi = require('joi')


const userValidator = {
  createUser: Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.empty': 'O nome é obrigatório',
      'string.min': 'O nome deve ter no mínimo 3 caracteres',
      'any.required': 'O nome é obrigatório',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'O e-mail é obrigatório',
      'string.email': 'O e-mail deve ser válido',
      'any.required': 'O e-mail é obrigatório',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'A senha é obrigatória',
      'string.min': 'A senha deve ter no mínimo 6 caracteres',
      'any.required': 'A senha é obrigatória',
    }),
  }),

  loginUser: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'O e-mail é obrigatório',
      'string.email': 'O e-mail deve ser válido',
      'any.required': 'O e-mail é obrigatório',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'A senha é obrigatória',
      'any.required': 'A senha é obrigatória',
    }),
  }),

  editUser: Joi.object({
    id: Joi.number().required().messages({
      'number.base': 'O ID deve ser um número',
      'any.required': 'O ID é obrigatório',
    }),
    name: Joi.string().optional().messages({
      'string.base': 'O nome deve ser uma string',
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'O e-mail deve ser válido',
    }),
    type: Joi.string().valid('client', 'medico', 'admin').optional().messages({
      'string.base': 'O tipo deve ser uma string',
      'any.only': 'O tipo deve ser "client", "medico" ou "admin"',
    }),
  }),

  getById: Joi.object({
    id: Joi.number().required().messages({
      'number.base': 'O ID deve ser um número',
      'any.required': 'O ID é obrigatório',
    }),
  }),

  passwordRecovery: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'O e-mail é obrigatório',
      'string.email': 'O e-mail deve ser válido',
      'any.required': 'O e-mail é obrigatório',
    }),
  }),

  changePassword: Joi.object({
    password: Joi.string().min(6).required().messages({
      'string.empty': 'A nova senha é obrigatória',
      'string.min': 'A nova senha deve ter no mínimo 6 caracteres',
      'any.required': 'A nova senha é obrigatória',
    }),
    id: Joi.number().required().messages({
      'number.base': 'O ID deve ser um número',
      'any.required': 'O ID do usuário é obrigatório',
    }),
    token: Joi.string().required().messages({
      'string.empty': 'O token de recuperação é obrigatório',
      'any.required': 'O token de recuperação é obrigatório',
    }),
  }),
}

function validate(schema, body) {
  const { error } = schema.validate(body)
  if (error) {
    throw new Error(error.details[0].message)
  }
}


module.exports = {
  async getUsers(req, res) {
    try {
      const users = await db('users').select('id', 'name', "email", "type", "created_at", "updated_at")
      return res.json(users)
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },

  async createUser(req, res) {
    try {
      validate(userValidator.createUser, req.body)
      const { name, email, password } = req.body

      const emailExist = await db('users').where({ email }).first()

      if (emailExist) {
        return res.status(406).json({ error: "Esse email ja esta cadastrado" })
      }

      const salt = await bcrypt.genSalt(saltrounds)
      const hash = await bcrypt.hash(password, salt)
      const type = "client"

      await db('users').insert({ name, email, password: hash, type })

      return res.json({ mensage: "Usuario cadastrado " })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro ao cadastrar usuario", detail: error.message })
    }
  },

	async getById(req, res) {
    try {
      validate(userValidator.getById, req.body)
      const { id } = req.body

      const user = await findUserById(id)

      if (!user) {
        return res.status(404).json({ error: "Usuario não encontrado" })
      }

      return res.json(user)
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", detail: error.message })
    }
  },
 	

  async editUser(req, res) {
    try {
      validate(userValidator.editUser, req.body)
      const { id, name, email, type } = req.body

      const user = await findUserById(id)

      if (!user) {
        return res.status(404).json({ error: "O usuário não existe" })
      }

      const editUser = {}

      if (email !== undefined && email !== user.email) {
        const result = await db('users').select("*").where({ email })

        if (result.length === 0) {
          editUser.email = email
        } else {
          return res.status(400).json({ error: "O e-mail já está cadastrado" })
        }
      }

      if (name !== undefined) {
        editUser.name = name
      }

      if (type !== undefined) {
        editUser.type = type
      }

      await db('users').update(editUser).where({ id })

  // buscar o usuário atualizado
      const updated = await findUserById(id)

      // reemitir novo token com os dados atualizados
      const newToken = jwt.sign(
        { id: updated.id, email: updated.email, name: updated.name, type: updated.type },
        secret,
        { expiresIn: '1h' }
      )
      res.cookie('session', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/'
      })

      return res.json({ message: "Usuário editado com sucesso" })
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", detail: error.message })
    }
  },

	async passwordRecovery(req, res) {
    try {
      validate(userValidator.passwordRecovery, req.body)
      const { email } = req.body

      const user = await findUserByEmail(email)

      if (user) {
        await db('passwordtokens').where({ user_id: user.id, used: 0 }).update({ used: 1 })

        const token = crypto.randomBytes(20).toString('hex')

        await db('passwordtokens').insert({
          user_id: user.id,
          token,
          used: 0
        })

        return res.json(token)
      } else {
        return res.status(404).json({ error: "Usuario não encontrado" })
      }
    } catch (error) {
      return res.status(400).json({ error: "Erro ao gerar token de recuperação", detail: error.message })
    }
  },
	
	async changePassword(req, res) {
    try {
      validate(userValidator.changePassword, req.body)
      const { password, id, token } = req.body

      const tokenValid = await db('passwordtokens')
        .select("*")
        .where({ token, used: 0, user_id: id })
        .first()

      if (tokenValid) {
        const hash = await bcrypt.hash(password, saltrounds)

        await db('users').where({ id }).update({ password: hash })
        await db('passwordtokens').where({ token }).update('used', 1)

        return res.status(200).json({ mensage: "Senha atualizada com sucesso. Você ja pode fazer o login com a nova senha" })
      } else {
        return res.status(400).json({ error: "Token invalido ou expirado" })
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro no servidor", detail: error.message })
    }
  },

	async login(req, res) {
    try {
      validate(userValidator.loginUser, req.body)
      const { email, password } = req.body

      const user = await findUserByEmail(email)

      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
          const token = jwt.sign(
            { id:user.id, email: user.email, name: user.name, type: user.type },
            secret,
            { expiresIn: "1h" }
          )

          res.cookie("session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
          })

          return res.status(200).json({ mensage: "Login feito com sucesso" })
        } else {
          return res.status(400).json({ error: "Senha informada incorreta" })
        }
      } else {
        return res.status(404).json({ error: "Usuário não encontrado" })
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro no servidor", detail: error.message })
    }
  },

	async me(req, res) {
    const token = req.cookies.session // pega o token do cookie
  
    if (!token) {
      return res.status(400).json({ error: "Token não encontrado no cookie" })
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Cookies recebidos:", req.cookies);
      return res.json({ user: decoded })
    } catch (error) {
      return res.status(500).json({ error: "Token inválido", detail: error.message })
    }
  },
  async  getTokenInfo(req, res) {
    const { token } = req.query
    const result = await db('passwordtokens').where({ token, used: 0 }).first()
  
    if (!result) return res.status(404).json({ error: 'Token inválido' })
  
    return res.json({ user_id: result.user_id })
  }
}
