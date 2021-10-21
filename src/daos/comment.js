const createCommentDao = (author, post, body, createdAt = new Date()) => {
  return {
    author,
    post,
    body,
    createdAt,
  };
};

module.exports = createCommentDao;
