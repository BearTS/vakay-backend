module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        isVerfiied: {
            type: Sequelize.BOOLEAN
        },
        avatar: {
            type: Sequelize.STRING
        },
        hash: {
            type: Sequelize.STRING
        }
    })
    return Users
}