require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createTodo } = require('./zod');
const { todo } = require('./db'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', async (req, res) => {
    try {
        const todos = await todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/add', async (req, res) => {
    console.log("Incoming request body:", req.body);

    const createPayload = req.body;
    const newTodo = createTodo.safeParse(createPayload);

    if (!newTodo.success) {
        console.error("Validation errors:", newTodo.error.errors);
        res.status(400).json({ msg: "Invalid inputs", errors: newTodo.error.errors });
        return;
    }

    try {
        await todo.create({
            todo: createPayload.todo,
            completed: false,
        });
        res.json({ msg: "Successfully created todo" });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ msg: "Error creating todo" });
    }
});

app.patch('/update', async (req, res) => {
    try {
        const { todoId, todoCompleted } = req.body;
        const updatedTodo = await todo.findByIdAndUpdate(todoId, { completed: todoCompleted });
        res.json({ msg: "Successfully updated todo"});
    } catch (err) {
        res.status(500).json({ msg: "Updation failed" });
    }
});

app.delete('/delete', async (req, res) => {
    try {
        const { todoId } = req.body;
        await todo.findByIdAndDelete(todoId);
        res.json({ msg: "Successfully deleted todo" });
    } catch (err) {
        res.status(500).json({ msg: "Deletion failed" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
