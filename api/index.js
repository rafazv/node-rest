const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const { formatosAceitos } = require('./Serializador')

app.use(bodyParser.json())
app.use((req, res, prox) => {
    let formatoRequisitado = req.header('Accept')

    if(formatoRequisitado === '*/*') formatoRequisitado = 'application/json'

    if(formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.send()
        return
    }

    res.setHeader('Content-Type', formatoRequisitado)
    prox()
})

app.use('/api/fornecedores', roteador)

app.use((erro, req, res, prox) => {
    let status = 500
    if(erro instanceof NaoEncontrado) status = 404
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) status = 400
    if(erro instanceof ValorNaoSuportado) status = 406

    res.status(status)
    res.send(JSON.stringify({mensagem: erro.message, id: erro.idErro}))
})

app.listen(config.get('api.porta'), () => console.log('tudo de boa'))