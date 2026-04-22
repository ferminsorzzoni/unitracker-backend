function setStatus(code) {
    return function(req, res, next) {
        res.status(code);
        next();
    }
}

export { setStatus };