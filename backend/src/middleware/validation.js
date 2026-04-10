/**
 * Validates POST /tasks body.
 * Require `title` to be a non-empty string (max 200 chars).
 */

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


/**
 * Validates PATCH /tasks/:id body.
 * Accepts `completed` (boolean) and/or `title` (non-empty string).
 */

function validateUpdateTask(req, res, next) {
    const { completed, title } = req.body;
    const hasCompleted = completed !== undefined;
    const hasTitle = title !== undefined;

    if(!hasCompleted && !hasTitle) {
        return res.status(400).json({
            error: "validation failed",
            message: "Request body must include at least one of: 'completed', 'title'.",
        });
    }

    if(hasCompleted && typeof completed !== "boolean") {
        return res.status(400).json({
            error: "validation failed",
            message: "Field 'completed', must be a boolean.",
        }); 
    }

    if(hasTitle) {
        if(typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({
                error: "validation failed",
                message: "Field 'title' must be a non-empty string.",
            });
        }

        if(title.trim().length > 200) {
            return res.status(400).json({
                error: "validation failed",
                message: "Field 'title' must be 200 characters or fewer.",
            });
        }
    }

    next();
}

module.exports = { validateCreateTask, validateUpdateTask };
