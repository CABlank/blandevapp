const {Schema, model} = require('mongoose')

const ToDoTaskSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  value: {
    type: Boolean,
    required: true
  },
  todo_id: {
    type: String,
    required: true
  }

}, {
  timestamps: true
})

module.exports = model('ToDoTask', ToDoTaskSchema);