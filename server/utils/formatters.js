const getAuthorId = (author) => {
  if (!author) return "";
  return author._id ? author._id.toString() : author.toString();
};

const getAuthorName = (blog) => {
  if (blog.author && blog.author.name) return blog.author.name;
  if (blog.authorName) return blog.authorName;
  return "Anonymous";
};

const formatUser = (user, token) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  profilePic: user.profilePic || "",
  profileImage: user.profileImage || user.profilePic || user.avatar || "",
  avatar: user.avatar || user.profileImage || user.profilePic || "",
  bio: user.bio || "",
  gender: user.gender || "",
  location: user.location || "",
  authProvider: user.authProvider || "local",
  role: user.role || "user",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  ...(token ? { token } : {}),
});

const formatBlog = (blog) => {
  const source = typeof blog.toObject === "function" ? blog.toObject() : blog;
  const authorId = getAuthorId(source.author);

  return {
    _id: source._id.toString(),
    title: source.title,
    content: source.content,
    description: source.description,
    image: source.image || "",
    category: source.category || "",
    categoryColor: source.categoryColor || "",
    tags: source.tags || [],
    readTime: source.readTime || "",
    author: getAuthorName(source),
    authorId,
    userId: authorId,
    likes: Array.isArray(source.likes) ? source.likes.length : source.likes || 0,
    likedBy: (source.likes || []).map((like) => like.toString()),
    comments: source.comments || [],
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

export { formatUser, formatBlog };
