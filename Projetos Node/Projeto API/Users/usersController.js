const express = require("express");
const User = require("../Users/users"); // Modelo de usuário
const router = express.Router();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const auth = require("../middleware/Authenticator")

const JWTSecret = "çafjlçojçagolnaçlngkangçglanpihgeanga"

router.use(cors()); // Habilita CORS para permitir requisições externas

// Rota para listar todos os usuários (API)
router.get("/users", auth, (req, res) => {
    User.findAll().then(users => {
        res.json(users); // Retorna os usuários como JSON
    })
});


// Rota para cadastrar um novo usuário (API)
router.post("/user", (req, res) => {
    const { user, email, password } = req.body;

    if (user && email && password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        User.create({
            user: user,
            email: email,
            password: hash
        }).then(() => {
            res.status(200).json({ mensagem: "Usuário cadastrado com sucesso" });
        }).catch((error) => {
            res.status(400).json({ mensagem: "Erro ao cadastrar usuário" });
        });
    } else {
        res.status(400).json({ mensagem: "Campos obrigatórios não preenchidos" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
        }

        // Buscar usuário no banco
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ mensagem: "Usuário incorreto" });
        }

        // Comparar senha criptografada
        const correct = bcrypt.compareSync(password, user.password);

        if (!correct) {
            return res.status(401).json({ mensagem: "Senha informada está incorreta" });
        }

        jwt.sign({id: user.id, email: user.email},JWTSecret, {expiresIn: "1h"}, (error, token) =>{
            if(error){
                res.status(400).json({mensagem: "Erro de sistema"})
            }else{
                // Responder com um "token" (simulado)
                res.json({ token: token });
            }
        })
        

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
});

module.exports = router;
