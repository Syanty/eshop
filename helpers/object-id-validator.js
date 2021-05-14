const responseHandler = require("../helpers/response-handler");
const mongoose = require("mongoose");

function validateObjectId(res, id) {
  if (!mongoose.isValidObjectId(id)) {
    responseHandler.badrequest(res, "Invalid user Id");
  }
}

module.exports = validateObjectId;
