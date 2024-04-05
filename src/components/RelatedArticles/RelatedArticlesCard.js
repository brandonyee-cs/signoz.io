import React from "react";

import relatedArticleCoverImage from "../../../static/img/hexagonal-pattern.webp";

import "./RelatedArticles.module.css";

export default function RelatedArticlesCard({ article }) {
  const handleClick = () => {
    window.open(article.url, "_blank");
  };

  return (
    <div
      className="max-w-xs rounded overflow-hidden shadow-lg cursor-pointer bg-neutral-800"
      onClick={handleClick}
    >
      <a href="#">
        <img
          className="w-full h-24 object-cover"
          src={relatedArticleCoverImage}
          alt=""
        />
      </a>
      <div className="px-2 py-2 bg-neutral-800">
        <div className="font-bold text-md mb-2 text-left tracking-tight line-clamp-2 text-ellipsis">
          {article.title}
        </div>
        <div className="text-xs mb-2 text-left">{article.publishedOn}</div>
      </div>
    </div>
  );
}
