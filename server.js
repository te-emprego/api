require('dotenv').config()

const app = require('./src/app')

console.clear()
app.listen(process.env.PORT, (err) =>
    err
        ? console.log('erro')
        : console.log('Serviço iniciado')
)