const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')
const Produto = require('./models/Produto')

const PORT = 3000
const hostname = 'localhost'

let log = false
let usuario = ''
let tipoUsuario = ''

// Config Express ----------------------------------
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 
app.use(express.static('public'))
// -------------------------------------------------
// Config Handlebars -------------------------------
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
// -------------------------------------------------
app.post('/comprar', async (req,res)=>{
    const dados_carrinho = req.body
    console.log(dados_carrinho)

    const atualiza_promise = []

    for (const item of dados_carrinho){
        const produto = await Produto.findByPk(item.cod_prod, {raw: true})
        console.log(produto)
        if(!produto || produto.quantidadeEstoque < item.qtde){
           return  res.status(400).json({message: "produto insuficiente ou não disponível" + produto.quantidadeEstoque})
        }

        const atualiza_promessas = await Produto.update(
            { quantidadeEstoque: produto.quantidadeEstoque - item.qtde},
            {where: { id: item.cod_prod}}
        )
        atualiza_promise.push(atualiza_promessas)
    }

    try{
        await Promise.all(atualiza_promise)
        res.status(200).json({message: "compra realizada com sucesso!"})
    }catch(error){
        console.error("Erro ao atualizar os dados"+error)
        res.status(500).json({message: "Erro ao processar a compra"})
    }
})


app.get('/carrinho', (req,res)=>{
    res.render('carrinho', {log, usuario, tipoUsuario})
})
// ------------------SIM--------------------
app.post('/editar_produto', async (req,res)=>{
    const nome = req.body.nome
    const tamanho = (req.body.tamanho)
    const quantidadeEstoque = Number(req.body.quantidadeEstoque)
    const precoUnitario = Number(req.body.precoUnitario)
    const descricao = req.body.descricao
    const dados = await Produto.findOne({raw:true, where: {nome:nome}})
    res.redirect('/editar_produto')

})

app.post('/consulta_produto', async (req, res)=>{
    const nome = req.body.nome
    const dados = await Produto.findOne({raw:true, where: {nome:nome}})
    res.render('editar_produto',{log, usuario, tipoUsuario, valor:dados} )
})

app.get('/editar_produto', (req,res)=>{
    res.render('editar_produto', {log, usuario, tipoUsuario})
})

app.get('/listar_produto', async (req,res)=>{
    const dados = await Produto.findAll({raw:true})
    console.log(dados)
    res.render('listar_produto', {log, usuario, tipoUsuario, valores:dados})
})

app.post('/cadastrar_produto', async (req,res)=>{
    const nome = req.body.nome
    const tamanho = req.body.tamanho
    const quantidadeEstoque = req.body.quantidadeEstoque
    const precoUnitario = req.body.precoUnitario
    const descricao = req.body.descricao
    await Produto.create({nome:nome, tamanho:tamanho, quantidadeEstoque:quantidadeEstoque, precoUnitario: precoUnitario, descricao: descricao})
    let msg = 'Dados Cadastrados'
    res.render('cadastrar_produto', {log, usuario, tipoUsuario,msg})
})

app.get('/cadastrar_produto', (req,res)=>{
    res.render('cadastrar_produto', {log, usuario, tipoUsuario})
})

app.get('/contato',(req,res)=>{
    res.render('contato',{log})
})

app.get('/historia',(req,res)=>{
    res.render('historia',{log})
})


app.post('/login',async(req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Usuario.findOne({raw:true, where:{email:email, senha:senha}})
    let msg = 'Usuário não encontrado'
    if(pesq == null){
        res.render('home',{log,msg})
    }else if(pesq.tipo === 'Gerente') {
        log = true,
        usuario = pesq.nome
        tipoUsuario  = pesq.tipo
        res.render('gerenciador',{log,usuario})
    } else if(pesq.tipo ==='Cliente'){
        log = true,
        usuario = pesq.nome
        tipoUsuario  = pesq.tipo
        res.render('home',{log,usuario})
    }else{
        usuario = pesq.nome
        res.render('home',{log,usuario})
    }
})

app.get('/gerenciador',(req,res)=>{
    res.render('gerenciador',{log,usuario})
})

app.get('/login',(req,res)=>{
    res.render('login',{log})
})

app.get('/logout',(req,res)=>{
    log = false,
    usuario = ''
    res.render('login',{log})
})

app.get('/',(req,res)=>{
    // log = false
    res.render('home',{log,usuario})
})

// ------------------------------------



conn.sync().then((req,res)=>{
    app.listen(PORT,hostname,()=>{
        console.log(`Deu boa ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('deu ruim'+error)
})
