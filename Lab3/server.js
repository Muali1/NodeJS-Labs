        import express from 'express';

        const app = express();
        const PORT = 3000;

    app.use(express.json());

    let todos = [
    { id: 1, title: "Learn Express.js", completed: false },
    { id: 2, title: "Build REST API", completed: true },
    { id: 3, title: "Test endpoints", completed: false }
    ];


        app.get('/api/todos', async (req, res) => {
        try {
            res.status(200).json({
            items: todos,
            total: todos.length
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
        });

        app.get('/api/todos/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const todo = todos.find(t => t.id === id);
            
            if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
            }
            
            res.status(200).json(todo);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
        });

        app.delete('/api/todos/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const todoIndex = todos.findIndex(t => t.id === id);
            
            if (todoIndex === -1) {
            return res.status(404).json({ message: "Todo not found" });
            }
            
            todos.splice(todoIndex, 1);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
        });

        app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });
