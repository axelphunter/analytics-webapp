const baseController = require('./baseController');
const layoutSchemaModel = require('../models/layoutSchemaModel');

module.exports = baseController.extend({
  name: 'Layout',

  postUpdateLayout(req, res) {
    const layoutId = req.body.layoutId;
    const gridObj = JSON.parse(req.body.gridObj);

    layoutSchemaModel.findOneAndUpdate({
        _id: layoutId,
        layout: gridObj
      })
      .then(() => {
        return res.sendStatus(200);
      })
      .catch(() => {
        return res.sendStatus(500);
      });
  }
});
