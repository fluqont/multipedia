import { Article } from "../types/article";
import Card from "../ui/card";
import ListWithHeader from "./list-with-header";
import classes from "./article-list.module.css";
import { Link } from "wouter";

interface ArticleListProps {
  articles: Article[];
  label: string;
  userIsMe: boolean;
  username: string;
}

export default function ArticleList({
  articles,
  label,
  username,
}: ArticleListProps) {
  return (
    <ListWithHeader headerLabel={label}>
      {articles.length > 0 && (
        <ul className={classes.list}>
          {articles.map((article) => (
            <li key={article.id}>
              <Link href={`/users/${username}/articles/${article.topic.title}`}>
                <Card title={article.topic.title} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ListWithHeader>
  );
}
