class NaoEncontrado extends Error {
    constructor(campo) {
        super(`${campo} não encontrado!`)
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado