import Task from "../model/task"

export const createTask = async (req, res, next) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.redirect('/tasks')
    } catch (error) {
        next(error)
    }
}

export const getTasks = (req, res, next) => {
    Task.find({owner: req.user._id})
    .then(tasks => {
        if(req.user){
            res.render('tasks', {
                user: req.user,
                title: 'Task Management',
                links: [{url:'/tasks',name:'home'}, {url:'/users', name:'settings'}],
                logout: {url:'/users/logout',name:'logout'},
                task: tasks
            })
        } else {
            next()
        }
    })
    .catch(err => next(err))
}

export const getTask = (req, res, next) => {
    const { _id } = req.params
    Task.findOne({_id, owner: req.user._id})
    .then(data => data ? res.send(data) : next({message:'task not found'}))
    .catch(err => next(err))
}
export const updateTask = (req, res, next) => {
    const { _id, priority, task_name } = req.body
    if(!task_name || !_id || !priority) return res.redirect('/tasks')
    if(priority && !['high','normal','low'].includes(priority)) return res.redirect('/tasks')
    Task.findOneAndUpdate({ _id, owner: req.user._id }, req.body, {new: true})
    .then(data => data ? res.redirect('/tasks') : next({message:'task not found'}))
    .catch(err => next(err))
}
export const deleteTask = (req, res, next) => {
    const { _id } = req.body
    Task.findOneAndDelete({_id, owner: req.user._id})
    .then(data => data ? res.redirect('/tasks') : next({message:'task not found'}))
    .catch(err => next(err))
}