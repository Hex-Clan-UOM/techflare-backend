const createPostDao = (author, title, body, createdAt = new Date()) => {
  return {
    author,
    title,
    body,
    createdAt,
  };
};

module.exports = createPostDao;
