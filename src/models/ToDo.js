const {Schema, model} = require('mongoose')

const ToDoSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  owner_id: {
    type: String,
    required: true
  },
  assigned_id: {
    type: String,
    required: true
  },
  user_assigned: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  }

}, {
  timestamps: true
})

module.exports = model('ToDo', ToDoSchema);