const all = (items, options, fn) => {
  const { document, cookie } = options;
  const promises = items.map((item) => fn(document, item, cookie));
  return Promise.all(promises);
};

const series = (items, fn) => {
  let result = [];
  return items
    .reduce((acc, item) => {
      acc = acc.then(() => {
        return fn(item).then((res) => result.push(res));
      });
      return acc;
    }, Promise.resolve())
    .then(() => result);
};

const splitToChunks = (items, chunkSize = 50) => {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
};

const chunks = (items, options, fn, chunkSize = 50) => {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, (chunk) => {
    return all(chunk, options, fn).then((res) => (result = result.concat(res)));
  }).then(() => result);
};

module.exports = {
  chunks,
};
