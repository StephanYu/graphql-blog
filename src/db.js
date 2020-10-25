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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
