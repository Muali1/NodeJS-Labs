        import express from 'express';

        const app = express();
        const PORT = 3000;

    // Middleware
    app.use(express.json());

    let todos = [
    { id: 1, title: "Learn Express.js", completed: false },
    { id: 2, title: "Build REST API", completed: true },
    { id: 3, title: "Test endpoints", completed: false }
    ];

    // Validation middleware
    const validateTodo = (req, res, next) => {
    const { title, completed } = req.body;
    
    if (title !== undefined) {
        if (typeof title !== 'string') {
        return res.status(400).json({
            error: {
            message: "Title must be a string",
            code: "VALIDATION_ERROR"
            }
        });
        }
        
        if (title.length === 0) {
        return res.status(400).json({
            error: {
            message: "Title is required",
            code: "VALIDATION_ERROR"
            }
        });
        }
        
        if (title.length > 200) {
        return res.status(400).json({
            error: {
            message: "Title must be 200 characters or less",
            code: "VALIDATION_ERROR"
            }
        });
        }
    }
    
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({
        error: {
            message: "Completed must be a boolean",
            code: "VALIDATION_ERROR"
        }
        });
    }
    
    next();
    };

        app.get('/api/todos', async (req, res) => {
        try {
            res.status(200).json({
            items: todos,
            total: todos.length
            });
        } catch (error) {
            res.status(500).json({
            error: {
                message: "Internal server error",
                code: "INTERNAL_ERROR"
            }
            });
        }
        });

        app.get('/api/todos/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const todo = todos.find(t => t.id === id);
            
            if (!todo) {
            return res.status(404).json({
                error: {
                message: "Todo not found",
                code: "NOT_FOUND"
                }
            });
            }
            
            res.status(200).json(todo);
        } catch (error) {
            res.status(500).json({
            error: {
                message: "Internal server error",
                code: "INTERNAL_ERROR"
            }
            });
        }
        });

        app.delete('/api/todos/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const todoIndex = todos.findIndex(t => t.id === id);
            
            if (todoIndex === -1) {
            return res.status(404).json({
                error: {
                message: "Todo not found",
                code: "NOT_FOUND"
                }
            });
            }
            
            todos.splice(todoIndex, 1);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
            error: {
                message: "Internal server error",
                code: "INTERNAL_ERROR"
            }
            });
        }
        });

        app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });
