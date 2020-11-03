const jwt = require('jsonwebtoken')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const {
    APP_SECRET,
} = process.env

export function encodeToken(tokenData) {
    return jwt.sign(tokenData, APP_SECRET)
}

export function decodeToken(token) {
    return jwt.verify(token, APP_SECRET)
}

export async function jwtLogin(req, res, next) {
    // if(req.session.token)return res.send({ message: 'already logged in'})
    // if(req.session.token)return res.redirect('/users/')
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(401)
            return res.send({ message: 'doesn\'t seems like a valid user.' })
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            res.status(401)
            return res.send({ message: 'invalid email or password.' })
        }
        const token = encodeToken({ _id : user._id.toString() })
        user.tokens = user.tokens.concat({token})
        await user.save()
        req.session.token = token
        // res.send({token})
        // res.redirect('/users/user')
        res.send({message: 'logged in!', id: user._id})
    } catch (error) {
        next(error)
    }
}

export async function jwtAuthenticationMiddleware(req, res , next) {
    try {
        let token = req.session.token
        if(!token) return next()
        token = token.replace('Bearer ','')
        const { _id } = decodeToken(token)
        const user = await User.findOne({_id, 'tokens.token': token})
        if(user) {
            req.user = user
            req.token = token
        }
    } catch (error) {
        return next(error)
    }
    next()
}

export async function isAuthenticatedMiddleware(req, res, next) {
    req.user ? next() : res.redirect('/login')
}

export async function jwtLogout(req, res, next) {
    try {
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token)
        await req.user.save()
        req.session.destroy(err=> {
            if(err) return res.send(err)
            res.clearCookie('connect.sid')
            // return res.send(req.user)
            return res.send({logout: true})
        })
    } catch (error) {
        next(error)
    }
}

export async function jwtLogoutAll(req, res, next) {
    try{
        req.user.tokens = []
        await req.user.save()
        req.session.destroy(err=> {
            if(err) return res.send(err)
            res.clearCookie('connect.sid')
            // return res.send(req.user)
            return res.send({logout: true})
        })
    } catch(error) {
        next(error)
    }
}

