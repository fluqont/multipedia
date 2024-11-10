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
import { getOrCreateTopicAction } from "../../api/topic-action";
import { publishAction } from "../../api/publish-action";
import { Article, Topic } from "../../types/article";
import { Data } from "../../lib/types";
import Form from "../../ui/form";
import { getColorScheme } from "../../lib/utils";

export default function NewArticle() {
  const { currentUser } = useCurrentUser();

  const editorRef = useRef<Editor>(null);

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

  const [topics, setTopics] = useState<null | FetchError | Data<Topic[]>>(null);
  useEffect(() => {
    async function asyncFetch() {
      setTopics(await getTopicsAction());
    }
    asyncFetch();
  }, []);

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

  const [result, setResult] = useState<null | StrapiError | Data<Article>>(
    null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const body = localStorage.getItem("body");
    if (body) {
      editorRef.current?.getInstance().setMarkdown(body);
    }
  }, [result]);

  const [newTopic, setNewTopic] = useState<null | StrapiError | Data<Topic>>(
    null
  );
  useEffect(() => {
    async function asyncFetch(topicId: number) {
      const formData = new FormData();
      formData.append("topic", searchValue);
      formData.append("body", editorRef.current?.getInstance().getMarkdown());
      setResult(await saveArticleAction(formData, topicId, currentUser));
    }
    if (newTopic && "data" in newTopic) {
      asyncFetch(newTopic.data.id);
    }
  }, [newTopic]);

  if (!topics) {
    return <p>loading...</p>;
  }

  if (topics && "error" in topics) {
    return <ErrorPage error={500}>Couldn't load topics</ErrorPage>;
  }

  if (newTopic && "error" in newTopic) {
    return <ErrorPage error={500}>Couldn't create topic</ErrorPage>;
  }

  if (result && loading) {
    setLoading(false);
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (topics && "data" in topics) {
      setNewTopic(await getOrCreateTopicAction(searchValue, topics));
    }
  }

  async function handlePublish() {
    if (result && "data" in result)
      setResult(await publishAction(result.data.documentId));
  }

  const zodErrors = result && "zodErrors" in result && result.zodErrors;
  return (
    <Form
      className={classes.form}
      error={result && "error" in result && result?.error}
      loading={loading}
      submitLabel="save to account"
      additionalButtons={
        <button
          type="button"
          onClick={handlePublish}
          disabled={result ? "data" in result && !result.data.draft : true}
        >
          publish
        </button>
      }
      onSubmit={handleSave}
    >
      <SearchableSelect
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        id="topic"
        dropdownItems={topics.data}
        error={zodErrors && zodErrors.topic}
      />
      <Editor
        previewStyle="tab"
        theme={getColorScheme()}
        hideModeSwitch={true}
        onChange={handleChange}
        ref={editorRef}
        initialValue=" "
      />
      {zodErrors && <p>{zodErrors.body}</p>}
      <Tips />
    </Form>
  );
}

export function Tips() {
  return (
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
  );
}
