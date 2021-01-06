const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')

const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const { formatosAceitos, SerializadorErro } = require('./Serializador')

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

app.use((req, res, prox) => {
    res.set('Access-Control-Allow-Origin', '*')
    prox()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

app.use((erro, req, res, prox) => {
    let status = 500
    if(erro instanceof NaoEncontrado) status = 404
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) status = 400
    if(erro instanceof ValorNaoSuportado) status = 406

    const serializador = new SerializadorErro(res.getHeader('Content-Type'))

    res.status(status)
    res.send(serializador.serializar
        ({mensagem: erro.message, id: erro.idErro}))
})

app.listen(config.get('api.porta'), () => console.log('tudo de boa'))