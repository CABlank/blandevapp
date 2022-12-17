const path = require('path')
var cookie = require('cookie');
const tasksCtrl = { }

const TaskList = require('../models/TaskList')
const Task = require('../models/Task')
const User = require('../models/User')
const Session = require('../models/Session')
const ToDo = require('../models/ToDo')
const ToDoTask = require('../models/ToDoTask')

checkToken = async (token, id) => {
  const sessionFinded = await Session.findById(id)
  let match = false
  if(sessionFinded) {
    match = await sessionFinded.matchToken(token)
    if(match) {
      if(sessionFinded.active) {
      } else {
        match = false
      }
    }
  }
  return match
}

tasksCtrl.renderTaskForm = async (req, res) => {
  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    const task = await TaskList.findById(req.params.id)
    const taskItems = await Task.find({tasklist_id: req.params.id})
    // console.log(taskItems)
    res.render(path.join(__dirname, '../editTask.html'), {taskItems, task})
  } else {
    res.redirect('/signin');  
  }
}

tasksCtrl.createNewTask = (req, res) => {
  res.send('task created')
}

tasksCtrl.getTasks = async (req, res) => {

  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    const session = await Session.findById(req.cookies.idSession)
    const getUser = await User.findById(session.user_id)
    var tasks = []
    if(getUser.role == 'admin'){
      tasks = await TaskList.find();
    } else {
      tasks = await TaskList.find({owner_id: session.user_id});
    }
    res.render(path.join(__dirname, '../taskList'), {tasks})
  } else {
    res.redirect('/signin');   
  }
}

tasksCtrl.renderTaskEditForm = async (req, res) => {
  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    res.send('task updated')
  } else {
    res.send('Not authorized')  
  }
}

tasksCtrl.updateTask = async (req, res) => {
  
  const ids = Object.keys(req.fields)
  const values = Object.values(req.fields)
  let index = 0

  var checkedAll = true
  const taskFinded = await Task.findById(ids[index])
  const tasklistId = taskFinded.tasklist_id
  for (const value of values) {
    const taskToUpdate = await Task.findById(ids[index])
    taskToUpdate.value = value
    await taskToUpdate.save()
    if(value == 'false') {
      checkedAll = false
    }
    index++
    
  }
  if(checkedAll) {
    const tasklistFinded = await TaskList.findById(tasklistId)
    tasklistFinded.status = true
    await tasklistFinded.save()

  }

  res.send({success_msg: 'Note checked successfully'})
}


// To Do functions

tasksCtrl.renderToDoCreateForm = async (req, res) => {
  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    const session = await Session.findById(req.cookies.idSession)
    console.log(session)
    const user = await User.findById(session.user_id)
    var users = []
    if(user.role == 'admin') {
      users = await User.find()
    }
    // console.log(taskItems)
    res.render(path.join(__dirname, '../createToDo.html'), {user, users})
  } else {
    res.redirect('/signin');  
  }
}

tasksCtrl.createNewToDo = async (req, res) => {
  
  const ids = Object.keys(req.fields)
  const values = Object.values(req.fields)
  console.log(ids)
  let index = 1
  const user = await User.findById(req.fields['assigned_id'])
  const toDo = new ToDo ({title: req.fields['title'], date : req.fields['date_to_do'], owner_id: req.fields['owner_id'], assigned_id: req.fields['assigned_id'], user_assigned: user.lastname, disabled: false, status: false})
  toDo.save()
  
  for (const id of ids) {
  
    if(req.fields[`task${index}`]) {
      console.log(req.fields[`task${index}`], req.fields[`description${index}`])
      if(req.fields[`description${index}`]) {
        
        const taskToDo = new ToDoTask({title: req.fields[`task${index}`], description: req.fields[`description${index}`], value: false, todo_id: toDo.id})
        taskToDo.save()
      } else {

        const taskToDo = new ToDoTask({title: req.fields[`task${index}`], value: false, todo_id: toDo.id})
        taskToDo.save()
      }
      index++
    }
    
  }
  res.send({success_msg: 'To-Do Succesfully Created'})
}

tasksCtrl.getToDos = async (req, res) => {

  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    const session = await Session.findById(req.cookies.idSession)
    var to_dos = []
    const getUser = await User.findById(session.user_id)
    if(getUser.role == 'admin') {
      to_dos = await ToDo.find();
    } else {
      to_dos = await ToDo.find({assigned_id: session.user_id});
    }
    res.render(path.join(__dirname, '../toDos'), {to_dos})
  } else {
    res.redirect('/signin');   
  }
}

tasksCtrl.renderToDoForm = async (req, res) => {
  const validToken = await checkToken(req.cookies.token, req.cookies.idSession)
  if(validToken) {
    const to_do = await ToDo.findById(req.params.id)
    const taskItems = await ToDoTask.find({todo_id: req.params.id})

    res.render(path.join(__dirname, '../editToDo.html'), {taskItems, to_do})
  } else {
    res.redirect('/signin');  
  }
}

tasksCtrl.updateToDo = async (req, res) => {
  
  const ids = Object.keys(req.fields)
  const values = Object.values(req.fields)
  let index = 0

  var checkedAll = true
  const taskFinded = await ToDoTask.findById(ids[index])
  const toDoId = taskFinded.todo_id
  for (const value of values) {
    const taskToUpdate = await ToDoTask.findById(ids[index])
    taskToUpdate.value = value
    await taskToUpdate.save()
    if(value == 'false') {
      checkedAll = false
    }
    index++
  }
  if(checkedAll) {
    const tasklistFinded = await ToDo.findById(toDoId)
    tasklistFinded.status = true
    await tasklistFinded.save()

  }

  res.send({success_msg: 'Task checked successfully'})
}


module.exports = tasksCtrl