import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvote: 0, comments: [] });

  useEffect(() => {
    setArticleInfo({});
  });

  const { articleId } = useParams();
  const article = articles.find((article) => article.name === articleId);
  if (!article) {
    return <NotFoundPage />;
  } else {
    return (
      <>
        <h1>{article.title}</h1>
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </>
    );
  }
};

export default ArticlePage;
