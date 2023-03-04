const { Post, User } = require('../models');
const PostController = {
  getAllPosts({}, res) {
    Post.find()
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getPostByID({ params }, res) {
    Post.findById({ _id: params.PostId })
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: 'This ID has no posts!' });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  
  addPost({ params, body }, res) {
    Post.create(body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { Posts: _id } },
        { new: true }
        );
      })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: 'This ID has no posts!' });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
    },

    removePost({ params }, res) {
      Post.findOneAndDelete({ _id: params.PostId })
        .then((deletedPost) => {
          if (!deletedPost) {
            return res.status(404).json({ message: 'This ID has no posts!' });
          }
          return User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { Posts: params.PostId } },
            { new: true }
          );
        })
        .then((dbPostData) => {
          if (!dbPostData) {
            res.status(404).json({ message: 'This ID has no posts!' });
            return;
          }
          res.json(dbPostData);
        })
        .catch((err) => res.json(err));
    },

    updatePost({ params, body }, res) {
      Post.findOneAndUpdate({ _id: params.PostId }, body, {
        new: true,
        runValidators: true,
      })
        .then((dbPostData) => {
          if (!dbPostData) {
            res.status(404).json({ message: 'This ID has no post!' });
            return;
          }
          res.json(dbPostData);
        })
        .catch((err) => res.status(400).json(err));
    },

  addReaction({ params, body }, res) {
    Post.findOneAndUpdate(
      { _id: params.PostId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).json({ message: 'This ID has no posts!' });
          return;
        }
        res.json(dbPostData);
      })
      .catch((err) => res.json(err));
  },


  removeReaction({ params }, res) {
    Post.findOneAndUpdate(
      { _id: params.PostId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => res.json(err));
  },
};

module.exports = PostController;