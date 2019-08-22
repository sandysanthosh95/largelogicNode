let userController = require('./controllers/user')

module.exports = (app) => {
    //users
    app.post('/users/register', userController.save)

    app.get('/users/user', userController.getuser)
   
}
