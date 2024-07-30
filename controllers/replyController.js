const replyModel = require('../models/replyModel');

const getAllReplies = async (req, res) => {
    try {
      const replies = await replyModel.getAllReplies();
      res.status(200).json(replies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


module.exports = {
    getAllReplies
};
