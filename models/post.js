const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: 'What are you thinking?.',
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
    username: {
      type: String,
      required: 'Please enter your username.',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const postSchema = new Schema(
  {
    postText: {
      type: String,
      required: 'You must enter your thoughts.',
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: 'PLEASE ENTER YOUR USERNAME!',
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

postSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Post = model('Post', postSchema);

module.exports = Post;
