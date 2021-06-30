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
        res.render("admin/index") 
    })
    app.use("/admin", admin)
    //Public 
    app.use(express.static(path.join(__dirname, "public")))    
    //OUTROS
const PORT = 8081

app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA ${PORT}`)
})

console.log("digitei na feature")