import {json, type LoaderArgs} from "@remix-run/node"
import {Form, Link, useLoaderData, useSearchParams} from "@remix-run/react"

import {API} from "~/services"

export async function loader({request}: LoaderArgs) {
  const url = new URL(request.url)

  const query = url.searchParams.get("q") ?? ""

  if (!query) {
    return json({channels: []})
  }

  const data = await API.getListOfChannels({q: query})

  return json(
    {channels: data.items},
    {
      headers: {
        "Cache-Control": String(60 * 60 * 30),
      },
    },
  )
}

export default function Channels() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <Form action="" method="get">
        <input name="q" type="text" defaultValue={searchParams.get("q") ?? ""} />
      </Form>
      <div>
        {data.channels.map(channel => {
          return (
            <div key={channel.id.channelId}>
              <Link to={`/channel/${channel.id.channelId}`}>{channel.id.channelId}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
