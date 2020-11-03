export const _404_ = (req, res, next) => {
    res.status(404).render('404', {
        status: 404,
        message: 'you are lost!',
        title: 'This page doesn\'t exists',
        links: [{url:'/',name:'home'}]
    })
}