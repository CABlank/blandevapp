const {Schema, model} = require('mongoose')

const TaskListSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  owner_id: {
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
  },

}, {
  timestamps: true
})

module.exports = model('TaskList', TaskListSchema);