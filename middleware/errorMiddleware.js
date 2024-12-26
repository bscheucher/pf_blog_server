export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}
