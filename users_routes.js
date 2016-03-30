exports.defineRoutes = function(usersRouter, usersModule) {

    //GET users/      - view all
    //GET users/:id   - view user

    //GET users/new   - createuser view
    //POST users/new  - createuser save

    //GET users/:id/update    - updateuser view
    //POST users/:id/update   -  updateuser save

    //GET users/:id/delete - delete

    usersRouter.route('/new').get(usersModule.newUserView);
    usersRouter.route('/new').post(usersModule.newUserSave);

    usersRouter.route('/:user_id/update').get(usersModule.updateUserView);
    usersRouter.route('/update').post(usersModule.updateUserSave);

    usersRouter.route('/:user_id/delete/').get(usersModule.deleteUser);

    usersRouter.route('/api/user').get(usersModule.getUserData);
    usersRouter.route('/:user_id').get(usersModule.getUserView);

    usersRouter.route('/').get(usersModule.getAllUsers);

};