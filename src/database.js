const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const {NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE} = process.env
const MONGODB_URI = `mongodb+srv://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`

mongoose.connect(MONGODB_URI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
})
  .then(db => console.log('Database is conected') )
  .catch(err => console.log(err))