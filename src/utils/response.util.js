const response = (message, status, res, payload, metadata = {}) => {
  res.status(status).json([
    {
      status,
      message,
      payload,
      metadata,
    },
  ]);
};

const serverErrorResponse = (error, res) => {
  res.status(500).json([
    {
      status: 500,
      message: "Internal server error",
      payload: error,
      metadata: {},
    },
  ]);
};

module.exports = {
  response,
  serverErrorResponse,
};
