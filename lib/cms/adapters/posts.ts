import {
  getInternalPosts as getInternalPostsRaw,
  getInternalPost as getInternalPostRaw,
  getInternalSlugs as getInternalSlugsRaw,
  getExternalPosts as getExternalPostsRaw,
  getAllPosts as getAllPostsRaw,
  getRecentPosts as getRecentPostsRaw,
  type InternalPost,
  type ExternalPost,
  type Post,
} from '../../posts'

export const getInternalPosts = getInternalPostsRaw
export const getInternalPost  = getInternalPostRaw
export const getInternalSlugs = getInternalSlugsRaw

export const fetchExternalPosts = getExternalPostsRaw  // async via RSS
export const fetchAllPosts      = getAllPostsRaw       // async
export const fetchRecentPosts   = getRecentPostsRaw    // async

export type { InternalPost, ExternalPost, Post }
