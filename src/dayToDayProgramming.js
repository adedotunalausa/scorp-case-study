const getPosts = async (requestingUserId, postIds) => {
  if (requestingUserId && postIds) {
    try {
      const postFeed = [];

      for (let postId of postIds) {
        const currentPost = await getPostById(postId);
        let Post;
        if (currentPost) {
          const postOwner = await getPostOwner(postId);
          const postOwnerId = postOwner.id
          const User = {
            id: postOwnerId,
            username: postOwner.username,
            full_name: postOwner.full_name,
            profile_picture: postOwner.profile_picture,
            followed: await isPostOwnerFollowedByRequestingUser(requestingUserId, postOwnerId)
          }

          Post = {
            id: postId,
            description: currentPost.description,
            owner: User,
            image: currentPost.image,
            created_at: currentPost.created_at,
            liked: await isPostLikedByRequestingUser(postId, requestingUserId)
          }
        }

        postFeed.push(Post);
      }

      return postFeed;
    } catch (error) {
      return error;
    }
  }
}

const isPostOwnerFollowedByRequestingUser = async (requestingUserId, postOwnerId) => {
  const follow = await getFollow(requestingUserId, postOwnerId);
  return follow ? true : false;
}

const isPostLikedByRequestingUser = async (postId, requestingUserId) => {
  const like = await getLike(postId, requestingUserId);
  return like ? true : false;
}

const getFollow = (followerId, followingId) => {
  return new Promise((resolve, reject) => {
    const getFollowQuery = `SELECT * FROM follow WHERE follower_id = ? AND following_id = ?`;
    mysqlPool.query(getFollowQuery, [followerId, followingId], (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

const getLike = (postId, userId) => {
  return new Promise((resolve, reject) => {
    const getLikeQuery = `SELECT * FROM likes WHERE like_post_id = ? AND like_user_id = ?`;
    mysqlPool.query(getLikeQuery, [postId, userId], (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

const getPostOwner = async (postId) => {
  const post = await getPostById(postId);
  const postUserId = post.post_user_id;
  return await getUserById(postUserId);
}

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const getUserQuery = `SELECT * FROM user where id = ?`;
    mysqlPool.query(getUserQuery, userId, (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

const getPostById = (postId) => {
  return new Promise((resolve, reject) => {
    mysqlPool.query(`SELECT * FROM post WHERE id = ?`, postId, (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}