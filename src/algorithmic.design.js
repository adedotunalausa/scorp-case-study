const mergePosts = (listOfPosts) => {
  let combinedPosts = [];

  for (let postList of listOfPosts) {
    combinedPosts.push(...postList);
  }

  let uniquePosts = getUniquePosts(combinedPosts);

  sortByIdPostsWithSameCreatedAt(uniquePosts);

  return uniquePosts.reverse();
}

const getUniquePosts = (combinedPosts) => {
  let postsDict = {};
  let uniquePosts = [];

  for (let post of combinedPosts) {
    if (!postsDict[post.id]) {
      uniquePosts.push(post);
    }
    postsDict[post.id] ? postsDict[post.id] = + 1 : postsDict[post.id] = 1;
  }

  return uniquePosts;
}

const sortByIdPostsWithSameCreatedAt = (uniquePosts) => {
  for (let i = 1; i <= uniquePosts.length - 2; i++) {
    const currentPost = uniquePosts[i];
    const nextPost = uniquePosts[i + 1];
    if (currentPost.created_at === nextPost.created_at && (currentPost.id > nextPost.id)) {
      swap(uniquePosts, i, i + 1);
    }
  }
}

const swap = (array, index1, index2) => {
  [array[index1], array[index2]] = [array[index2], array[index1]];
}