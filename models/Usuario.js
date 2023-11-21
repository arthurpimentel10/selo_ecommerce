const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const Usuario = db.define('usuario',{
    nome:{
        type:DataTypes.STRING(50)
    },
    email:{
        type:DataTypes.STRING(50)
    },
    senha:{
        type:DataTypes.STRING(50)
    },
    tipo:{
        type:DataTypes.STRING(50)   // Adm ou cliente
    },
},{
    createdAt:false,
    updatedAt:false
})

// Usuario.sync({force:true})

module.exports = Usuario