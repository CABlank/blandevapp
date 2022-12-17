const path = require('path')
const indexCtrl = { }

indexCtrl.renderIndex = (req, res) => {
  res.render(path.join(__dirname, '../index.html'))
}

module.exports = indexCtrl