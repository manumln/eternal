const isAdmin = (req, res, next) => {
    if (req.role !== "admin") {
      return next(new ExpressError(401, "You are not Authorized"));
    }
    next();
  };