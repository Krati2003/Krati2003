import "./header.css";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">Discover stories from writers on any topic</span>
        <span className="headerTitleLg">Stay Curious</span>
      </div>
      <img
        className="headerImg"
        src="https://st2.depositphotos.com/1420973/6409/i/450/depositphotos_64095317-stock-photo-blog-concept-cloud-chart-print.jpg"
        alt=""
      />
    </div>
  );
}
