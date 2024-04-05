import React, { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import RelatedArticlesCard from "./RelatedArticlesCard";
import { fetchRelatedArticles } from "../../api/relatedArticles";

export default function RelatedArticles() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loadingRelatedArticles, setLoadingRelatedArticles] = useState(false);
  const blogPath = window.location.pathname;
  const AIRTABLE_URL = `${customFields.AIRTABLE_BASE_URL}?filterByFormula={blogURL}='${blogPath}'&maxRecords=1`;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${customFields.AIRTABLE_KEY}`,
    },
  };

  useEffect(() => {
    setLoadingRelatedArticles(true);
    const fetchAndCacheData = async () => {
      try {
        const articles = await fetchRelatedArticles(
          AIRTABLE_URL,
          blogPath,
          3600000,
          options
        );

        if (articles && Array.isArray(articles)) {
          setRelatedArticles(articles);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRelatedArticles(false);
      }
    };

    fetchAndCacheData();
  }, []);

  return (
    <div className="flex gap-8 flex-wrap py-8">
      <h2 className="pb-0 mb-0"> Related Articles </h2>

      <div className="flex gap-8 flex-wrap pb-8">
        {!loadingRelatedArticles &&
          relatedArticles.map((relatedArticle, index) => (
            <RelatedArticlesCard article={relatedArticle} key={index} />
          ))}
      </div>
    </div>
  );
}
