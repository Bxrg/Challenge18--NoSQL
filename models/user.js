const { Schema, model } = require('mongoose');
const Post = require('./Post');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'Enter your username here.',
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      match: [
        /.+@.+\..+/,
        "Please write something valid.",
      ],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

UserSchema.pre("remove", function (next) {
  Post.remove({ username: this.username }).exec();
  next();
});

const User = model('User', UserSchema);

module.exports = User;