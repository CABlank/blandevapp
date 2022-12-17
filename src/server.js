const express = require('express')
const path = require('path')
const morgan = require('morgan')
var engines = require('consolidate');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const cookieParser = require("cookie-parser");

const TaskList = require('./models/TaskList')
const Task = require('./models/Task')
const User = require('./models/User')
var cron = require('node-cron');


var bodyParser = require('body-parser');

const formidable = require('express-formidable');

const app = express();
require('./config/passport')

cron.schedule('0 0 * * *', async () => {
  const users = await User.find()
 
  for (const user of users) {
    
    const newTaskList = new TaskList ({title: 'Daily Tasks', owner: user.lastname, owner_id: user.id, disabled: false, status: false, })
    newTaskList.save()
    const newTask1 = new Task ({title: 'Avisar tiempo comprometido del dia para el trabajo y fuera del trabajo ( Aplica disponibilidad obligatoria de Lunes a Viernes ).', value: false, tasklist_id: newTaskList.id})
    newTask1.save()
    const newTask2 = new Task ({title: 'Determinar el alcance del dia ( Escribir cosas que deseas completar en el dia )', value: false, tasklist_id: newTaskList.id, description: '( Escribir cosas que deseas completar )' })
    newTask2.save()
    const newTask3 = new Task ({title: 'Preguntar dudas respecto del proyecto.', value: false, tasklist_id: newTaskList.id, description: '( Aclarar y revisar a detalle todas las tareas para preguntar, no se puede preguntar durante el dia )' })
    newTask3.save()
    const newTask4 = new Task ({title: 'Usar Github.', value: false, tasklist_id: newTaskList.id })
    newTask4.save()
    const newTask5 = new Task ({title: 'Terminar 100% una tarea antes de empezar con la siguiente ( Al menos que se requiera con urgencia otra ).', value: false, tasklist_id: newTaskList.id })
    newTask5.save()
    const newTask6 = new Task ({title: ' Anadir siempre el "to do" de hubstaff correctamente .', value: false, tasklist_id: newTaskList.id })
    newTask6.save()
    console.log(newTaskList)
    const newTaskList2 = new TaskList ({title: 'Tasks Reviews', owner: user.lastname, owner_id: user.id, disabled: false, status: false, })
    newTaskList2.save()
    const newTask2_1 = new Task ({title: 'Chequeo de estructura del codigo .', value: false, tasklist_id: newTaskList2.id})
    newTask2_1.save()
    const newTask2_2 = new Task ({title: 'Ordenar y documentar el codigo del dia .', value: false, tasklist_id: newTaskList2.id})
    newTask2_2.save()
    const newTask2_3 = new Task ({title: 'Verificar que el codigo es reutilizable en la medida de lo posible .', value: false, tasklist_id: newTaskList2.id})
    newTask2_3.save()
    const newTask2_4 = new Task ({title: 'Enviar el commit a revision .', value: false, tasklist_id: newTaskList2.id})
    newTask2_4.save()
    const newTask2_5 = new Task ({title: 'Verificar To-Dos de hubstaff .', value: false, tasklist_id: newTaskList2.id})
    newTask2_5.save()
  }

  console.log('running a task every day');
});

app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev'))
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(formidable());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user || null
  next()
})


app.use(require('./routes/index.routes'))
app.use(require('./routes/tasks.routes'))
app.use(require('./routes/users.routes'))
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'))
// })

app.use(express.static(path.join(__dirname, 'public')))

module.exports = app