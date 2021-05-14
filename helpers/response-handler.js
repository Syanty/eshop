const responseHandler = {
  found(res, payload) {
    return res.status(200).send({
      success: true,
      data: payload,
    });
  },
  notfound(res, message) {
    return res.status(404).send({
      success: false,
      message: message,
    });
  },
  added(res, message) {
    return res.status(201).send({
      success: true,
      message: message,
    });
  },
  updated(res, message) {
    return res.status(200).send({
      success: true,
      message: message,
    });
  },
  deleted(res, message) {
    return res.status(200).send({
      success: true,
      message: message,
    });
  },
  error(res, error) {
    return res.status(500).send({
      success: false,
      error: error,
    });
  },
  badrequest(res, message) {
    return res.status(400).send({
      success: false,
      message: message,
    });
  },
};

module.exports = responseHandler;
