function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({
      success: false,
      message: "The user is not authorised",
    });
  }
  /* if(err.name === 'ValidationError'){
        return res.status(401).send({
            success:false,
            message:"Validation Error",
            error: err
        })
    } */

  return res.status(500).send({
    success: false,
    error: err,
  });
}

module.exports = errorHandler;
