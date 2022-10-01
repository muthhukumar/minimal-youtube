import {type LoaderArgs, json} from "@remix-run/node"
import {Form, Link, useLoaderData, useSearchParams} from "@remix-run/react"

import {API} from "~/services"

export async function loader({request, params}: LoaderArgs) {
  const url = new URL(request.url)

  const query = url.searchParams.get("q") ?? ""

  if (!query) {
    return json({videos: []})
  }

  const data = await API.getListOfVideos({q: query, channelId: params.channelId})

  const videos = data.items

  return json(
    {videos},
    {
      headers: {
        "Cache-Control": String(60 * 60 * 30),
      },
    },
  )
}

export default function Channel() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <Form action="" method="get">
        <input name="q" type="text" defaultValue={searchParams.get("q") ?? ""} />
      </Form>
      <div className="">
        {data.videos.map(video => {
          return (
            <div key={video.id.videoId}>
              <Link to={`/video/${video.id.videoId}`}>{video.id.videoId}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
