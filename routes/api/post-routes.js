const router = require('express').Router();
const {
  getAllPosts,
  getPostByID,
  addPost,
  updatePost,
  removePost,
  addReaction,
  removeReaction,
} = require('../../controllers/post-controller');

router.route('/').get(getAllPosts);
router.route('/:userId').post(addPost);
router
  .route('/:userId/:postId')
  .get(getPostByID)
  .put(updatePost)
  .post(addReaction)
  .delete(removePost);

router.route('/:userId/:postId/:reactionId').delete(removeReaction);

module.exports = router;