import {Link} from "@remix-run/react"

export default function Index() {
  return (
    <div>
      <div>
        <div>
          <Link to="/videos">Videos</Link>
        </div>
        <div>
          <Link to="/channels">Channels</Link>
        </div>
      </div>
    </div>
  )
}
