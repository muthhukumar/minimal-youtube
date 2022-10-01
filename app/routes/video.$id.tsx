import {useParams} from "@remix-run/react"

export default function Video() {
  const {id} = useParams()
  return (
    <div>
      <iframe
        width="100%"
        height="900px"
        allowFullScreen
        title="Youtube Video"
        src={`https://www.youtube.com/embed/${id}`}
      ></iframe>
    </div>
  )
}
