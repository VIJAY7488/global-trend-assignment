function validateCreateTask(req, res, next) {
    const { title } = req.body;

    if(title === undefined || title === null) {
        return res.status(400).json({
            error: "Validation failed",
            message: " Field 'title' is required."
        });
    }

    if(typeof title !== "string") {
        return res.status(400).json({
            error: "Validation failed",
            message: "Field 'title' must be a string.",
        });
    }

    if(title.trim().length === 0) {
        return res.status(400).json({
            error: "Validation failed",
            message: "Field 'title' must not be empty.",
        }); 
    }

    if(title.trim().length > 200) {
        return res.status(400).json({
            error: "Validation failed",
            message: "Field 'title' must be 200 characters or fewer.",
        });
    }

    next();
}