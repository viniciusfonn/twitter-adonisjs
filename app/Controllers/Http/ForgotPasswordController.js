'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')

class ForgotPasswordController {
    async store({ request, response }) {
        try {
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)

            user.token = crypto.randomBytes(10).toString('hex')
            user.token_created_at = new Date()

            await Mail.send(
                ['emails.forgot_password'],
                {
                    email,
                    token: user.token,
                    link: `${request.input('redirect_url')}?token=${user.token}`
                },
                message => {
                    message
                        .to(user.email)
                        .from('vinao@bolado.com')
                        .subject('esqueceu a senha')
                }

            )

            await user.save()

        } catch (error) {
            return response
                .status(error.status)
                .send({ error: { message: 'email errado' } })
        }
    }

    async update({ request, response }) {
        try {
            const { token, password } = request.all()

            const user = await User.findByOrFail('token', token)

            const tokenExpired = moment()
                .subtract('1', 'days')
                .isAfter(user.token_created_at)

            if(tokenExpired){
                return response
                .status(401)
                .send({ error: { message:'token expirado' } })
            }
            
            user.token = null
            user.token_created_at = null
            user.password = password

            await user.save()
            
        } catch (error) {
            return response
                .status(error.status)
                .send({ error: { message:'aconteceu algum problema na hora de resetar a senha' } })
        }
    }
}

module.exports = ForgotPasswordController
