const express = require("express")
//COMPONENTE PARA CRIAR ROTAS EM ARQUIVOS SEPARADOS
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Página principal do painel ADM")
})

router.get("/posts", (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req, res) => {
    res.send("Página de categorias")
})

module.exports = router