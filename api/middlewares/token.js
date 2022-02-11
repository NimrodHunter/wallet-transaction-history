module.exports = (tokenName, tokenValue) => (req, res, next) => {
  const token = req.get(tokenName);

  if (token == null || token === "" || token !== tokenValue) {
    next(new Error("Invalid token"));
  } else {
    next();
  }
};
