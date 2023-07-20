const generateMetadata = (req, count, offset, limit) => {
  const dataOffset = parseInt(offset);
  const dataLimit = parseInt(limit);
  const requestUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
  const requestUrlArr = requestUrl.split(/[&?]+/);
  const originalUrl = removeOffsetLimit(requestUrlArr);

  const previousUrl = generatePreviousUrl(originalUrl, dataOffset, dataLimit);
  const nextUrl = generateNextUrl(originalUrl, dataOffset, dataLimit, count);
  const currentUrl = generateCurrentUrl(requestUrl, dataOffset, dataLimit);

  return {
    count,
    prev: previousUrl,
    next: nextUrl,
    current: currentUrl,
  };
};

const generateCurrentUrl = (requestUrl, offset, limit) => {
  if (offset === 0 && limit === 0) {
    return null;
  } else {
    return requestUrl;
  }
};

const generatePreviousUrl = (originalUrl, offset, limit) => {
  return offset >= 0 && limit > 0
    ? offset - limit < 0
      ? null
      : `${originalUrl}&offset=${offset - limit}&limit=${limit}`.replace(
          /[?&]+/,
          "?"
        )
    : null;
};

const generateNextUrl = (originalUrl, offset, limit, count) => {
  return offset >= 0 && limit > 0
    ? offset + limit >= count
      ? null
      : `${originalUrl}&offset=${offset + limit}&limit=${limit}`.replace(
          /[?&]+/,
          "?"
        )
    : null;
};

const removeOffsetLimit = (urlArr) => {
  const removeOffset = urlArr.filter((item) => !item.includes("offset"));
  const removeLimit = removeOffset.filter((item) => !item.includes("limit"));
  const rawUrl = removeLimit[0] + "?";

  removeLimit.shift();
  const queryUrl = removeLimit.join("&");

  return rawUrl + queryUrl;
};

module.exports = generateMetadata;
