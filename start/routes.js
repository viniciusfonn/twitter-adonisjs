'use strict'

const Route = use('Route')

Route.post('forgotpassword', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('forgotpassword', 'ForgotPasswordController.update').validator('ResetPassword')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('users', 'UserController.store').validator('User')

Route.group(() => {
    Route.get('users/:id', 'UserController.show')
    Route.put('users/:id', 'UserController.update').validator('User')
    Route.delete('users/:id', 'UserController.destroy')

    Route.resource('publications', 'PublicationController').apiOnly().validator(
        new Map(
            [
                [
                    ['publications.store'],
                    ['Publication']
                ],
                [
                    ['publications.update'],
                    ['Publication']
                ]
            ]
        )
    )

    Route.resource('publications.comments', 'CommentController').apiOnly().validator(
        new Map(
            [
                [
                    ['publications.comments.store'],
                    ['Comment']
                ],
                [
                    ['publications.comments.store'],
                    ['Comment']
                ]
            ]
        )
    )

}).middleware(['auth'])

