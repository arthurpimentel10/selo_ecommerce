const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const Produto = db.define('produto',{
    nome: {
        type: DataTypes.STRING(50)  // nome da camisa
    },
    tamanho:{
        type: DataTypes.STRING(30)   // 38
    },
    quantidadeEstoque: {
        type: DataTypes.INTEGER
    },
    precoUnitario: {
        type: DataTypes.FLOAT  // 123.45
    },
    descricao: {
        type: DataTypes.TEXT
    }
},{
    createdAt:false,
    updatedAt:false
})

// Produto.sync({force:true})

module.exports = Produto