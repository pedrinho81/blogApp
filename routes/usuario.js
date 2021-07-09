const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")

router.get("/registro", (req, res) => {
    res.render("usuario/registro")
})
router.post("/registro", (req, res) => {
    let erros = []

    if(!req.body.nome || req.body.nome.length < 4) {
        erros.push({texto:"Nome inválido"})
    }

    if(!req.body.email || req.body.email.length < 4) {
        erros.push({texto: "E-mail inválido"})
    }
    
    if(!req.body.senha || req.body.senha.length < 4) {
        erros.push({texto: "Senha inválida"})
    }
    if(req.body.senha != req.body.senha2 ) {
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }

    if(erros.length > 0) {
        req.flash("error_msg", "Verifique os campos abaxo")
        res.render("usuario/registro", {erros: erros})
    }else {
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Já existe um usuário cadastrado com este e-mail.")
                res.redirect("/usuario/registro")
            } else {
                const novoUsuario = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                    
                bcrypt.genSalt(10,(erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro ao salvar o usuário.")
                            res.redirect("/usuario/registro")
                        } else {
                            novoUsuario.senha = hash

                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso!")
                                res.redirect("/")
                            }).catch((err) => {
                                req.flash("error_msg", "Houve um erro interno.")
                                res.redirect("/")
                            })
                        }
                    })
                })




            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuario/login")
})
module.exports = router