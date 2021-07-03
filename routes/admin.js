const { Console } = require("console")
const express = require("express")
//COMPONENTE PARA CRIAR ROTAS EM ARQUIVOS SEPARADOS
const router = express.Router()
//COMO INSERIR DADOS NO MONGO
//1- PEGA O MONGO
const mongoose = require("mongoose")
//2-PEGA O MODEL
require("../models/Categorias")
require("../models/Postagem")
//3 CHAMA A FUNÇÃO QUE VAI PASSAR UMA REFERENCIA DO SEU MODEL PARA UMA VARIAVEL
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")

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
router.get("/categorias/edit/:id", (req, res) => {
       
    Categoria.findById({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
       
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/delete/", (req, res) => {
    Categoria.deleteOne({_id: req.body.idDelete}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", (req, res) => {
        
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
        const Nome = req.body.nome
        const Slug = req.body.slug
        categoria.nome = Nome
        categoria.slug = Slug
        let erros = []

        if(!Nome) {
            erros.push({texto: "Nome da categoria inválido"})
        }
        if(Nome.length < 2) {
            erros.push({texto: "Nome da categoria é muito pequeno!"})
        }
    
        if(!Slug) {
            erros.push({texto: "Slug da categoria inválido!"})
        }

        if(erros.length > 0) {
            req.flash("error_msg", "Houve um erro ao editar a categoria, Verifique novamente os campos")
            
            res.redirect("/admin/categorias")
        } else {
                categoria.save().then(() => {
                req.flash("success_msg", "Categoria alterada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
            req.flash("error_msg", "Ops! houve um erro interno ao editar a categoria, tente novamente!")
            res.redirect("/admin/categorias")})
        }
        
        })
      })  

        
router.get("/postagens", function(req, res) {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then(function(postagens) {
         
     res.render("admin/postagens", { postagens: postagens });
          })
          .catch(function(err) {
            req.flash("error_msg", "Houve um erro ao listar as  postagens");
            res.redirect("/admin/postagens");
          });
      });     
          
          
            

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias:categorias})
    }).catch((err) => {
        console.log("oi" + err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário, tente novamente! ")
        res.redirect("/admin/postagens")
    })
    
})

router.post("/postagens/nova", (req, res) => {
    
    let erros = []

    if(req.body.categoria == 0) {
        erros.push({texto: "Categoria inválida, selecione uma categoria"})
    }

    if(erros.length > 0) {
        res.render("admin/addpostagens", {erros: erros})
    }else {
        const Titulo = req.body.titulo
        const Slug = req.body.slug
        const Descricao = req.body.descricao
        const Conteudo = req.body.conteudo
        const Categoria = req.body.categoria
        const novaPostagem = {
            titulo: Titulo,
            slug: Slug,
            descricao: Descricao,
            conteudo: Conteudo,
            categoria: Categoria
        }

        new Postagem(novaPostagem).save().then((postagens)=> {
            req.flash("success_msg", "Postagem adicionada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao adicionar a categoria")
            res.redirect("/admin/postagens")
        })

        
    }

})

router.get("/postagens/edit/:id", (req, res) => {
    
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
        
            res.render("admin/editpostagens", {postagem: postagem, categorias:categorias})

        })
    }).catch((err) => {
        req.flash("error_msg", "Postagem não existe")
        res.redirect("/admin/postagens")
    })

    
})

router.post("/postagens/edit", (req, res) => {
   
    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        //pegando do body os campos editados
        const Titulo = req.body.titulo;
        const Slug = req.body.slug
        const Descricao = req.body.descricao
        const Conteudo = req.body.conteudo
        const Categoria = req.body.categoria
        console.log(postagem.titulo)

        //EDITANDO A POSTAGEM
            postagem.titulo = Titulo,
            postagem.slug = Slug,
            postagem.descricao = Descricao,
            postagem.conteudo = Conteudo,
            postagem.categoria = Categoria
        

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
           
                req.flash("error_msg", "Ops! erro ao editar, tente novamente!")
                res.redirect("/admin/postagens")
            })
        })
    }) 

router.post("/postagens/delete", (req, res) => {
    
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) =>{
        req.flash("error_msg", "Erro interno ao deletar, tente novamente!")
        res.redirect("/admin/postagens")
    })

    
})

        
            
        

        
        

        

       

        // if(erros.length > 0) {
        //     req.flash("error_msg", "Houve um erro ao editar a categoria, Verifique novamente os campos")
            
        //     res.redirect("/admin/categorias")
        // } else {
        //     categoria.save().then(() => {
        //         req.flash("success_msg", "Categoria alterada com sucesso!")
        //         res.redirect("/admin/categorias")
        //     }).catch((err) => {
        //     req.flash("error_msg", "Ops! houve um erro interno ao editar a categoria, tente novamente!")
        //     res.redirect("/admin/categorias")})
        // }
        
        // })
      



module.exports = router