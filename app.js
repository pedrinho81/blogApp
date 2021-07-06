//CARREGANDO MÓDULOS
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const admin = require("./routes/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
Postagem = mongoose.model("postagens")
require("./models/Categorias")
Categoria = mongoose.model("categorias")

//CONFIFURAÇÕES
    //session
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true,
    }))
    app.use(flash())
    //middlewares
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    //HandleBars
    app.engine("handlebars", handlebars({defaultLayout:"main"}))
    app.set("view engine", "handlebars")
    //MONGOOSE
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Conectado com sucesso!")
        }).catch((err) =>{
            mongoose.Promise = global.Promise;
            console.log("Erro ao conectar: " + err)
        })
    //ROTAS
    app.get("/", (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens}) 
        }).catch((err) => {
            res.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
        
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem) {
                res.render("postagens/index", {postagem:postagem})
            } else {
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias:categorias})

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias.")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
           
            if(categoria) {
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens:postagens, categoria:categoria})
                })
                
            }else {
                req.flash("error_msg", "Esta categoria não existe")
            }
            
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as postagens desta categoria")
            res.redirect("/")
        })
    })

    app.get("/404",(req, res) => {
        res.send("ERRO 404!")
    })
    app.use("/admin", admin)
    //Public 
    app.use(express.static(path.join(__dirname, "public")))    
    //OUTROS
const PORT = 8081

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`)
})

