const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('ecommerce','root','senai',{
    host: 'localhost',
    dialect: 'mysql'
})

// sequelize.authenticate().then(()=>{
//     console.log('Deu boa')
// }).catch((error)=>{
//     console.error('deu ruim'+error)
// })

module.exports = sequelize