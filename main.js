const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gravidade = 0.03
const friccao = 0.99

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

class Particula {
    constructor(x, y, raio, cor, velocidade) {
        this.x = x
        this.y = y
        this.raio = raio
        this.cor = cor
        this.velocidade = {
            x: velocidade.x,
            y: velocidade.y
        }
        this.opacidade = 1
    }
    desenhar() {
        ctx.save()
        ctx.globalAlpha = this.opacidade
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2, false)
        ctx.fillStyle = this.cor
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    atualizar() {
        this.desenhar()
        this.velocidade.x *= friccao
        this.velocidade.y *= friccao
        this.velocidade.y += gravidade
        this.x += this.velocidade.x
        this.y += this.velocidade.y
        this.opacidade -= 0.003
    }
}
class Firework {
    constructor(x, y, raio, cor, velocidade) {
        this.x = x
        this.y = y
        this.raio = raio
        this.cor = cor
        this.velocidade = velocidade
        this.opacidade = 0.5
    }
    desenhar() {
        ctx.save()
        ctx.globalAlpha = this.opacidade
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2, false)
        ctx.fillStyle = this.cor
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    atualizar() {
        this.desenhar()
        this.velocidade *= friccao
        this.velocidade -= gravidade
        this.y -= this.velocidade
        this.opacidade += 0.005
    }
    setY() {
        this.yAnterior = this.y
    }
}

const fireworks = []
const particulas = []

function explosao(x, y) {
    const particulaQuantidade = 500
    const portencia = 12
    const radianos = Math.PI * 2 / particulaQuantidade
    const mouse = {x, y}
    for (let indice = 0; indice < particulaQuantidade; indice += 1) {
        const cor = `hsl(${Math.random() * 360}, 50%, 50%)`
        const x = Math.cos(radianos * indice) * Math.random() * portencia
        const y = Math.sin(radianos * indice) * Math.random() * portencia
        particulas.push(new Particula(mouse.x, mouse.y, 3, cor, {x, y}))
    }
}

function animacao() {
    requestAnimationFrame(animacao)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    fireworks.forEach((firework, indice) => {
        firework.atualizar()
        if (Math.floor(firework.y) === Math.floor(firework.yAnterior)) {
            explosao(firework.x, firework.y)
            fireworks.splice(indice, 1)
        }
        else {
            firework.setY()
        }
    })
    particulas.forEach((particula, indice) => {
        if (particula.opacidade > 0) {
            particula.atualizar()
        }
        else {
            particulas.splice(indice, 1)
        }
    })
}

addEventListener('click', (event) => {
    const portencia = 10.5
    const radianos = Math.PI * 2
    const mouse = {
        x: event.clientX,
        y: event.clientY
    }
    const cor = `hsl(${Math.random() * 360}, 50%, 50%)`
    const velocidade = portencia - (mouse.y / 50)
    fireworks.push(new Firework(mouse.x, canvas.height, 7, cor, velocidade))
})

animacao()