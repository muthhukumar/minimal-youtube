import {urls} from "./urls"

import invariant from "invariant"

const YT_API_KEY = process.env.YT_API_KEY

invariant(YT_API_KEY, "Please enter YT_API_KEY")

const getListOfVideos = async ({
  q = "",
  maxResults = 10,
  channelId,
}: {q?: string; maxResults?: number; channelId?: string} = {}) => {
  const url = new URL(urls.YT_VIDEO_SEARCH)

  if (maxResults) url.searchParams.set("maxResults", String(maxResults))
  if (channelId) {
    url.searchParams.set("channelId", channelId)
    url.searchParams.set("channelType", "any")
  }

  url.searchParams.set("q", q)
  url.searchParams.set("order", "date")
  url.searchParams.set("key", YT_API_KEY)
  url.searchParams.set("type", "video")
  url.searchParams.set("videoType", "any")

  try {
    const response = await fetch(url)
    const data = (await response.json()) as {
      items: Array<{kind: string; etag: string; id: {kind: string; videoId: string}}>
    }

    if (!response.ok) {
      return []
    }

    return data.items
  } catch (error) {
    return []
  }
}

const getListOfChannels = async ({
  q = "",
  maxResults = 10,
}: {q?: string; maxResults?: number} = {}) => {
  const url = new URL(urls.YT_CHANNEL_SEARCH)

  if (q) url.searchParams.set("q", String(q))
  if (maxResults) url.searchParams.set("maxResults", String(maxResults))

  url.searchParams.set("key", YT_API_KEY)
  url.searchParams.set("type", "channel")

  try {
    const response = await fetch(url)
    const json = (await response.json()) as {
      items: Array<{kind: string; etag: string; id: {kind: string; channelId: string}}>
    }

    if (!response.ok) {
      return []
    }

    return json.items
  } catch (error) {
    return []
  }
}

export const API = {
  getListOfVideos,
  getListOfChannels,
}
