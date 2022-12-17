require('dotenv').config()

const app = require('./src/server');
require('./src/database')


const hostname = '127.0.0.1';

app.listen(app.get('port'), hostname, () => {
  console.log('Server started on', app.get('port'))
})

