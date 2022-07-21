const handler = (req, res) => {
  const { id } = req.query;
  res.end(`Post: ${id}`);
};

export default handler;
