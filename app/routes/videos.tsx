import {json, type LoaderArgs} from "@remix-run/node"
import {Form, Link, useCatch, useLoaderData, useSearchParams} from "@remix-run/react"
import {API} from "~/services"

export async function loader({request}: LoaderArgs) {
  const url = new URL(request.url)

  const query = url.searchParams.get("q") ?? ""

  if (!query) {
    return json({videos: []})
  }

  const videos = await API.getListOfVideos({q: query})

  if (videos.length === 0) {
    throw json({message: "No videos found"}, {status: 404})
  }

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

export const CatchBoundary = () => {
  const caught = useCatch()
  const [searchParams] = useSearchParams()

  if (caught.status === 404) {
    return (
      <div>
        <Form action="" method="get">
          <input name="q" type="text" defaultValue={searchParams.get("q") ?? ""} />
        </Form>
        <h2>{caught.data.message}</h2>
      </div>
    )
  }

  return <h2>Something went wrong</h2>
}

export const ErrorBoundary = () => {
  return (
    <div>
      <h1>Internal server error</h1>
    </div>
  )
}
