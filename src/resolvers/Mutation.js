import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const isEmailUsed = db.users.some((user) => user.email === data.email);
    if (isEmailUsed) {
      throw new Error(
        "This email is already in use. Please select another one."
      );
    }

    const user = {
      id: uuidv4(),
      ...data,
    };
    db.users.push(user);

    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const { name, email, age } = data;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("No user found");
    }

    if (typeof email === "string") {
      const emailTaken = db.users.some((user) => user.email === email);
      if (emailTaken) {
        throw new Error("Email already taken");
      }
      user.email = email;
    }

    if (typeof name === "string") {
      user.name = name;
    }

    if (typeof age !== "undefined") {
      user.age = age;
    }

    return user;
  },
  deleteUser(parent, { id }, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("No user found");
    }
    const [deletedUser] = db.users.splice(userIndex, 1);

    // remove posts from user and all comments that belong to each post
    db.posts = db.posts.filter((post) => {
      const match = post.author === id;
      if (match) {
        db.comments = db.comments.filter((comment) => post.id !== comment.post);
      }
      return !match;
    });
    // remove all comments made by the user
    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUser;
  },
  createPost(parent, { data }, { db }, info) {
    const userExists = db.users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("This user does not exist");
    }
    const post = {
      id: uuidv4(),
      ...data,
    };

    db.posts.push(post);

    return post;
  },
  updatePost(parent, { id, data }, { db }, info) {
    const { title, body, published } = data;
    const post = db.posts.find((post) => post.id === id);
    if (!post) {
      throw new Error("No post found");
    }

    if (typeof title === "string") {
      post.title = title;
    }

    if (typeof body === "string") {
      post.body = body;
    }

    if (typeof published === "boolean") {
      post.published = published;
    }

    return post;
  },
  deletePost(parent, { id }, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new Error("No post found");
    }
    const [deletedPost] = db.posts.splice(postIndex, 1);

    // Remove all comments belonging to the post
    db.comments = db.comments.filter(
      (comment) => comment.post !== deletedPost.id
    );

    return deletedPost;
  },
  createComment(parent, { data }, { db }, info) {
    const userExists = db.users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("This user does not exist");
    }

    const postExists = db.posts.some(
      (post) => post.id === data.post && post.published
    );
    if (!postExists) {
      throw new Error("This post does not exist");
    }

    const comment = {
      id: uuidv4(),
      ...data,
    };

    db.comments.push(comment);

    return comment;
  },
  updateComment(parent, { id, data }, { db }, info) {
    const { text } = data;
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof text === "string") {
      comment.text = text;
    }

    return comment;
  },
  deleteComment(parent, { id }, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === id);
    if (commentIndex === -1) {
      throw new Error("This comment does not exist");
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);

    return deletedComment;
  },
};

export { Mutation as default };
