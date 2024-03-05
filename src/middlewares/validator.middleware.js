const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            let data = req.body;
            schema.parse(data);
            // surces 
            // console.log("I am here")
            next();
        } catch(exception) {
            next(exception)
        }
    }
}

module.exports = validateRequest