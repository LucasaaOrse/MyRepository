const jwt = require("jsonwebtoken")
const JWTSecret = "çafjlçojçagolnaçlngkangçglanpihgeanga"

function auth(req, res, next) {
    const authToken = req.headers["authorization"];
    console.log("TOKEN RECEBIDO NO BACKEND:", authToken); // 👈 Log para verificar o token

    if (authToken != undefined) {
        const bearer = authToken.split(" ");
        var token = bearer[1];

        jwt.verify(token, JWTSecret, (error, data) => {
            if (error) {
                console.log("Erro ao verificar token:", error);
                res.status(401).json({ error: "Token inválido" });
            } else {
                req.token = token;
                req.loggeUser = { id: data.id, email: data.email };
                next();
            }
        });
    } else {
        res.status(400).json({ error: "Token inválido ou não enviado" });
    }
}

module.exports = auth