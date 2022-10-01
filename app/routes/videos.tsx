import {json, type LoaderArgs} from "@remix-run/node"
import {Form, Link, useLoaderData, useSearchParams} from "@remix-run/react"
import {API} from "~/services"

export async function loader({request}: LoaderArgs) {
  const url = new URL(request.url)

  const query = url.searchParams.get("q") ?? ""

  if (!query) {
    return json({videos: []})
  }

  const data = await API.getListOfVideos({q: query})

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

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  console.log("here", data)
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
