const { Router } = require('express');
const router = Router()

const { renderTaskForm, createNewTask, getTasks, updateTask, renderToDoCreateForm, createNewToDo, getToDos, renderToDoForm, updateToDo } = require('../controllers/tasks.controller')

router.get('/tasks/check/:id', renderTaskForm)
router.post('/tasks/add', createNewTask)
router.get('/tasks/list', getTasks)
router.post('/tasks/update/:id', updateTask)


router.get('/todo/list', getToDos)
router.get('/todo/add', renderToDoCreateForm)
router.post('/todo/addTask', createNewToDo)
router.get('/todo/check/:id', renderToDoForm)
router.post('/todo/update/:id', updateToDo)

module.exports = router