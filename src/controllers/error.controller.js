export const error = (error, req, res, next) => {
    if(error.staus) {
        return res.status(error.status).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? '' : error.stack
        })
    } else {
        return res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? '' : error.stack
        })
    }
}