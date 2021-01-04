class CampoInvalido extends Error {
    constructor(campo) {
        const msg = `O campo '${campo}' está inválido`
        super(msg)
        this.name = 'CampoInvalido'
        this.idErro = 1
    }
}

module.exports = CampoInvalido