import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import SearchableSelect from "../../ui/searchable-select";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getArticle, saveArticleAction } from "../../api/save-article";
import { FetchError, StrapiError } from "../../types/fetch";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { getTopicsAction } from "../../api/get-topics";
import ErrorPage from "../../ui/error-page";
import { createTopicAction } from "../../api/create-topic";
import { publishAction } from "../../api/publish-action";

// TODO: move to types/
interface Article {
  documentId: string;
  id: number;
  body: string;
  draft: boolean;
}
export interface Topic {
  id: number;
  title: string;
}

export default function NewArticle() {
  const [topics, setTopics] = useState<null | FetchError | { data: Topic[] }>(
    null
  );
  useEffect(() => {
    async function asyncFetch() {
      setTopics(await getTopicsAction());
    }
    asyncFetch();
  }, []);

  const timeoutRef = useRef<number>();
  function handleChange() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(
        "body",
        editorRef.current?.getInstance().getMarkdown()
      );
    }, 1000);
  }

  const editorRef = useRef<Editor>(null);

  const { currentUser } = useCurrentUser();
  const [result, setResult] = useState<null | StrapiError | { data: Article }>(
    null
  );
  const [loading, setLoading] = useState(false);
  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    let topicId: number;
    if (topics && "data" in topics) {
      const createdTopic = topics.data.find(
        (topic) => topic.title === searchValue
      );
      if (!createdTopic) {
        const formData = new FormData();
        formData.append("title", searchValue);
        const topic = await createTopicAction(formData);

        if (!topic || "error" in topic || "zodErrors" in topic) {
          return <ErrorPage error={500}>Error creating a new topic</ErrorPage>;
        }

        topicId = topic.data.id;
        setTopics({ data: [...topics.data, topic.data] });
      } else {
        topicId = createdTopic.id;
      }

      const formData = new FormData(e.target as HTMLFormElement);
      formData.append("body", editorRef.current?.getInstance().getMarkdown());
      setResult(await saveArticleAction(formData, topicId, currentUser));
    }
  }

  const [searchValue, setSearchValue] = useState("");

  const [createdArticle, setCreatedArticle] = useState<
    null | FetchError | { data: Article[] }
  >(null);
  useEffect(() => {
    async function asyncFetch(id: number) {
      setCreatedArticle(await getArticle(currentUser!.id, id));
    }
    if (topics && "data" in topics) {
      const createdTopic = topics.data.find(
        (topic) => topic.title === searchValue
      );
      if (createdTopic && currentUser) {
        asyncFetch(createdTopic.id);
      }
    }
  }, [searchValue]);

  useEffect(() => {
    if (createdArticle && "data" in createdArticle) {
      editorRef.current?.getInstance().setMarkdown(createdArticle.data[0].body);
    }
  }, [createdArticle]);

  useEffect(() => {
    const body = localStorage.getItem("body");
    if (body) {
      editorRef.current?.getInstance().setMarkdown(body);
    }
  }, [result]);

  if (!topics) {
    return <p>loading...</p>;
  }

  if (topics && "error" in topics) {
    return <ErrorPage error={500}>Couldn't load topics</ErrorPage>;
  }

  if (result && loading) {
    setLoading(false);
  }

  console.log(result);

  async function handlePublish() {
    console.log(result);
    if (result && "data" in result)
      setResult(await publishAction(result.data.documentId));
  }

  const zodErrors = result && "zodErrors" in result && result.zodErrors;
  // TODO: use <Form>
  return (
    <form className={classes.form} onSubmit={handleSave}>
      {result && "error" in result && <p>{result.error}</p>}
      <SearchableSelect
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        id="topic"
        dropdownItems={topics.data}
        error={zodErrors && zodErrors.topic}
      />
      <Editor
        previewStyle="tab"
        theme={
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        }
        hideModeSwitch={true}
        onChange={handleChange}
        ref={editorRef}
        initialValue=" "
      />
      {zodErrors && <p>{zodErrors.body}</p>}
      <div>
        <p className={classes.p}>
          tip:{" "}
          <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
            learn markdown
          </a>{" "}
          to feel freedom
        </p>
        <p className={classes.p}>
          automatically saved to browser's storage every second
        </p>
      </div>
      <section className={classes.nav}>
        <button type="submit" disabled={loading}>
          save to account
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={result ? "data" in result && !result.data.draft : true}
        >
          publish
        </button>
      </section>
    </form>
  );
}
