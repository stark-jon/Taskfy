import User, { findById } from "../model/user"
const bcrypt = require('bcryptjs')
export const createUser = async (req, res, next) => {
    const user = new User(req.body)
    try {
        if(await User.findOne({email: req.body.email})) return res.send({message:'Email Exists!'})
        await user.save()
        return res.send({message: 'User Created, Please Login!'})
    } catch (error) {
        next(error)
    }
}
export const readUser = async (req, res ,next) => {
    req.user ? res.render('user',{
        user: req.user,
        title: 'Settings',
        links: [{url:'/tasks',name:'home'}],
        logout: {url:'/users/logout',name:'logout'}
    }) : res.redirect('/login')
}
export const updateUser = async (req, res, next) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password']
    const isValid = updates.every(update => allowedUpdates.includes(update))
    if(!isValid){
        return res.send({message: 'Can\'t Update'})
    }
    try {
        const user = req.user
        updates.forEach( update => user[update] = req.body[update])
        await user.save()
        res.send({user})
    } catch (error) {
        next(error)
    }
}
export const deleteUser = async (req, res, next) => {
    const { password } = req.body
    try {
        const user = await User.findById(req.user._id)
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.send({message: 'password could not match!'})
        await req.user.remove()
        res.clearCookie('connect.sid')
        return res.send({message: 'deleted!'})
    } catch (error) {
        next(error)
    }
}

export const isAuth = async (req, res, next) => {
    if(req.user){
        return res.send({isAuth: true})
    } else {
        req.session.destroy(err=>{
            if(err) return res.send(err)
            res.clearCookie('connect.sid')
            return res.send({isAuth: false})
        })
    }
}