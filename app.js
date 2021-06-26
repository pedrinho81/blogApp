//CARREGANDO MÓDULOS
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const admin = require("./routes/admin")
const path = require("path")
//CONFIFURAÇÕES
    //body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    //HandleBars
    app.engine("handlebars", handlebars({defaultLayout:"main"}))
    app.set("view engine", "handlebars")
    //MONGOOSE
        //
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