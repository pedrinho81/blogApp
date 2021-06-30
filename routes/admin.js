const { Console } = require("console")
const express = require("express")
//COMPONENTE PARA CRIAR ROTAS EM ARQUIVOS SEPARADOS
const router = express.Router()
//COMO INSERIR DADOS NO MONGO
//1- PEGA O MONGO
const mongoose = require("mongoose")
//2-PEGA O MODEL
require("../models/Categorias")
//3 CHAMA A FUNÇÃO QUE VAI PASSAR UMA REFERENCIA DO SEU MODEL PARA UMA VARIAVEL
const Categoria = mongoose.model("categorias")

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/categorias", (req, res) => {
    Categoria.find().sort({date: "desc"}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias.map(category => category.toJSON())})

    }).catch((err) => {
        res.redirect("/admin")
    })

    
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/categoriasadd")
})

router.post("/categorias/nova", (req, res) => {
    const Nome = req.body.nome
    const Slug = req.body.slug

    let erros = []

    if(!Nome) {
        erros.push({texto: "Nome da categoria inválido!"})
    }

    if(Nome.length < 2) {
        erros.push({texto: "Nome da categoria é muito pequeno!"})
    }

    if(!Slug) {
        erros.push({texto: "Slug da categoria inválido!"})
    }

    if(erros.length > 0) {
        req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
        res.render("admin/categoriasadd", {erros: erros}) 
       
    }else {
        const novaCategoria = {
            nome: Nome,
            slug: Slug
        }
    
        new Categoria(novaCategoria).save().then(()=> {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias").catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
                res.redirect("/admin/categorias")
            })
        })

        
    }

})

router.get("/posts", (req, res) => {
    res.send("Página de posts")
})


module.exports = router