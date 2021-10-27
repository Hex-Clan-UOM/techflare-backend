const createPostDao = (author, title, body, createdAt = new Date(), ...images) => {
  return {
    author,
    title,
    body,
    createdAt,
    images
  };
};

module.exports = createPostDao;
