const Tabela = require('./TabelaProduto')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInvalido')

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id,
        this.preco = preco,
        this.titulo = titulo,
        this.estoque = estoque,
        this.fornecedor = fornecedor,
        this.dataCriacao = dataCriacao,
        this.dataAtualizacao = dataAtualizacao,
        this.versao = versao
    }

    validar() {
        if(typeof this.titulo !== 'string' || this.titulo.length === 0) 
            throw new CampoInvalido('título')
        if(typeof this.preco !== 'number' || this.preco === 0)
            throw new CampoInvalido('preço')

    }

    async criar() {
        this.validar()
        const result = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = result.id,
        this.dataCriacao = result.dataCriacao,
        this.dataAtualizacao = result.dataAtualizacao,
        this.versao = result.versao
    }

    apagar() {
        return Tabela.remover(this.id, this.fornecedor)
    }

    async carregar() {
        const produto = await Tabela.pegarPorId(this.id, this.fornecedor)
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    atualizar() {
        const dadosParaAtualizar = {}

        if(typeof this.titulo === 'string' && this.titulo.length > 0)
            dadosParaAtualizar.titulo = this.titulo

        if(typeof this.preco === 'number' && this.preco > 0)
            dadosParaAtualizar.preco = this.preco

        if(typeof this.estoque === 'number' && this.estoque >= 0)
            dadosParaAtualizar.estoque = this.estoque

        if(Object.keys(dadosParaAtualizar).length === 0)
            throw new DadosNaoFornecidos()

        return Tabela.atualizar(
            {
                id: this.id,
                fornecedor: this.fornecedor
            },
            dadosParaAtualizar
        )
    }

    diminuirEstoque() {
        return Tabela.subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }
}

module.exports = Produto