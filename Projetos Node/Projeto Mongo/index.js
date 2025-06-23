const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://lucasorsee111:YHX042RLNtkqDqQY@cluster0.uoxzcop.mongodb.net/meubanco?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Conectado com sucesso!");
    const db = client.db("meubanco");
    const colecao = db.collection("usuarios");
    await colecao.insertOne({ nome: "Teste", idade: 99 });
    console.log("✅ Documento inserido!");
  } catch (err) {
    console.error("❌ Erro:", err);
  } finally {
    await client.close();
  }
}

run();
