const db = require('../database/connection');
const bcrypt = require('bcrypt')
const saltrounds = 10
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

module.exports = {
  async index(req, res) {
    try {
      const users = await db('users').select('id',"name", 'email', 'role');
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  async create(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." })
    } 

    const emailExist = await db('users').where({email: email}).first()

    if(emailExist){
        return res.status(406).json({error: "Esse email ja esta cadastrado"})
    }

    const salt = await bcrypt.genSalt(saltrounds)
    const hash = await bcrypt.hashSync(password, salt)


    try {
      await db('users').insert({ name, email, password: hash });
      return res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  },

  async getById(req, res){
    const id = req.params.id

    if(id == undefined){
        return res.status(404).json({error: "Id não encontrado"})
    }

    try {
        
      const user = await db('users').select('id','name', 'email', 'role', 'password').where({id: id})
      return res.status(200).json({menssage: "Usuario encontrado", user})

    } catch (error) {
      return res.staus(500).json({menssage: "Erro no servidor"})
    }
  },

  async editUser(req, res) {
    const { id, name, email, role } = req.body;
  
    const user = await db('users').select('*').where({ id });
  
    if (user.length === 0) {
      return res.status(404).json({ status: false, error: "O usuário não existe" });
    }
  
    const editUser = {};
  
    if (email !== undefined) {
      if (email !== user[0].email) {
        const result = await db('users').select('*').where({ email });
  
        if (result.length === 0) {
          editUser.email = email;
        } else {
          return res.status(400).json({ status: false, error: "O email já está cadastrado" });
        }
      }
    }
  
    if (name !== undefined) {
      editUser.name = name;
    }
  
    if (role !== undefined) {
      editUser.role = role;
    }
  
    try {
      await db('users').update(editUser).where({ id });
      return res.status(200).json({ message: "Usuário editado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao editar usuário" });
    }
  },

  async deleteUser(req, res){
    const id = req.params.id

    const result = await db('users').where({id}).select('*')

    if(result.length != 0){

      try {
        
        await db('users').where({id}).del()
        return res.status(200).json({menssage: "Usuario deletado com sucesso"})

      } catch (error) {
        return res.status(500).json({error: "Erro ao deletar usuario"})
      }

    }else{
      return res.status(404).json({error: "Usuario não encontrado"})
    }

  },

  async passwordRecover(req, res){
    const {email} = req.body

    const user = (await db('users').where({ email }).first());

    if (user) {

      try {

        const token = crypto.randomBytes(20).toString('hex')

        await db('passwordtokens').insert({
          user_id: user.id,
          token: token,
          used: 0
        })
        return res.status(200).json(token)

      } catch (error) {
        return res.status(400).json({error: "Erro ao gerar token"})
      }
      

    }else{
      return res.status(404).json({error: "Email não encontrado"})
    }
  },

  async changePassword(req, res){
    const {password, id, token} = req.body

    const tokenValid = await db('passwordtokens').select('*').where({token: token, used: 0, user_id: id}).first()

    if(tokenValid){

      const user = await db('users').where({id: id}).first()

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const hash = await bcrypt.hash(password, saltrounds);
      
      try {
        
        await db('users').where({id}).update('password', hash)
        await db('passwordtokens').where({token: token}).update('used', 1)
        return res.status(200).json({ message: "Senha atualizada com sucesso. Você já pode fazer login com a nova senha." });


      } catch (error) {
        return res.status(500).json({error: "Erro no servidor"})
      }
      
    }else{
      return res.status(400).json({error: "Token invalido"})
    }

  },

  async login(req, res) {
    const { email, password } = req.body
  
    const user = await db('users').where({ email }).first()
  
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
  
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Senha incorreta" })
    }
  
    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: "1h" }
    )
  
    // ATENÇÃO: Setando o cookie aqui 👇
    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hora em milissegundos
      path: "/"
    })
  
    // Agora só envia uma mensagem de sucesso
    return res.status(200).json({ message: "Login efetuado com sucesso" })
  },
  

  async me(req, res){
    const authHeader = req.headers.authorization

    if(!authHeader){
      return res.status(401).json({error: "Token não informado"})
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.decode(token, process.env.JWT_SECRET)

      return res.json({user: decoded})

    } catch (error) {
      return res.status(401).json({error: "Token invalido"})
    }
  }

}
