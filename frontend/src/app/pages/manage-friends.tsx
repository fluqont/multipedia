import UserProfile from "../../components/user-profile";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { jsonStrapi } from "../../lib/fetch-data";
import { getFriends } from "../../lib/get-friends";
import ErrorPage from "../../ui/error-page";
import atomics from "../../atomics.module.css";
import classes from "./manage-friends.module.css";
import { MinimalUser, User } from "../../types/user";
import { useState } from "react";
import { StrapiError } from "../../types/fetch";

export default function ManageFriends() {
  const { currentUser, updateCurrentUser } = useCurrentUser();

  const [result, setResult] = useState<null | User | StrapiError>(null);
  function handleDeleteClick(type: "incoming" | "outcoming") {
    return async function withType(id: number) {
      if (!currentUser) return;

      setResult(
        await jsonStrapi(
          "PUT",
          "/user/me",
          {
            [type]: currentUser[type]?.filter((user) => user.id !== id),
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        )
      );
      updateCurrentUser();
    };
  }

  if (!currentUser) {
    return (
      <ErrorPage error={500}>
        Unexpected error. User couldn't be loaded
      </ErrorPage>
    );
  }

  const { friends, outcoming, incoming } = getFriends(
    currentUser.outcoming,
    currentUser.incoming
  );

  if (result && "error" in result && result.error) {
    return <ErrorPage error={result.errorCode}>{result.error}</ErrorPage>;
  }

  return (
    <section className={classes.section}>
      <FriendsToManageList
        list={friends}
        label="friends"
        handleDeleteClick={handleDeleteClick("outcoming")}
      />
      <FriendsToManageList
        list={outcoming}
        label="outcoming"
        handleDeleteClick={handleDeleteClick("outcoming")}
      />
      <FriendsToManageList
        list={incoming}
        label="incoming"
        handleDeleteClick={handleDeleteClick("incoming")}
      />
    </section>
  );
}

interface FriendsToManageListProps {
  list: MinimalUser[];
  label: string;
  handleDeleteClick: (id: number) => void;
}

function FriendsToManageList({
  list,
  label,
  handleDeleteClick,
}: FriendsToManageListProps) {
  return (
    <figure>
      <h3 className={atomics.h3}>{label}</h3>
      <figcaption>
        {list.length > 0 ? (
          <ul>
            {list.map((user) => (
              <div className={classes.delete} key={user.id}>
                <UserProfile user={user} size="small" showEditButton={false} />
                <button onClick={() => handleDeleteClick(user.id)}>
                  delete
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p>no {label}</p>
        )}
      </figcaption>
    </figure>
  );
}
