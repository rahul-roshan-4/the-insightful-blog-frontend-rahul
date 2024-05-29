import { format } from "date-fns";
import { Link } from "react-router-dom";

function formatDateToReadable(date) {
  return format(date, "dd-MM-yyyy");
}

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  views,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={process.env.React_App_Host_Api + "/" + cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatDateToReadable(new Date(createdAt))}</time>
          <span>{views} views</span>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
