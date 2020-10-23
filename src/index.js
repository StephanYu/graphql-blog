import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// Dummy Data for users, posts, and comments
const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1",
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2",
  },
];

const comments = [
  {
    id: "1",
    text: "I totally agree with you, dog!",
    author: "2",
    post: "10",
  },
  {
    id: "2",
    text: "Incredible Post",
    author: "3",
    post: "10",
  },
  {
    id: "3",
    text: "WTF! You are insane.",
    author: "3",
    post: "12",
  },
];

const resolvers = {
  Query: {
    users(parent, args, context, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, context, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch | isBodyMatch;
      });
    },
    comments(parent, args, context, info) {
      return comments;
    },
  },
  Mutation: {
    createUser(parent, { data }, context, info) {
      const isEmailUsed = users.some((user) => user.email === data.email);
      if (isEmailUsed) {
        throw new Error(
          "This email is already in use. Please select another one."
        );
      }

      const user = {
        id: uuidv4(),
        ...data,
      };
      users.push(user);

      return user;
    },
    createPost(parent, { data }, context, info) {
      const userExists = users.some((user) => user.id === data.author);
      if (!userExists) {
        throw new Error("This user does not exist");
      }
      const post = {
        id: uuidv4(),
        ...data,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, { data }, context, info) {
      const userExists = users.some((user) => user.id === data.author);
      if (!userExists) {
        throw new Error("This user does not exist");
      }

      const postExists = posts.some(
        (post) => post.id === data.post && post.published
      );
      if (!postExists) {
        throw new Error("This post does not exist");
      }

      const comment = {
        id: uuidv4(),
        ...data,
      };

      return comment;
    },
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, context, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, context, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, context, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => {
  console.log("Server is running on http://localhost:4000");
});
