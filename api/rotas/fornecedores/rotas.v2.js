const roteador = require('express').Router()
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor
const TabelaFornecedor = require('./TabelaFornecedor')

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async (req, res) => {
    const result = await TabelaFornecedor.listar()

    res.status(200)
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(serializador.serializar(result))
})

module.exports = roteador