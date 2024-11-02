import { useUser } from "../lib/utils/context-as-hooks";
import { getFriends, MinimalUser } from "../lib/utils/get-friends";
import ErrorPage from "../ui/error-page";
import User from "../components/user";
import atomics from "../atomics.module.css";
import classes from "./manage-friends.module.css";
import { jsonStrapi } from "../lib/utils/fetch-data";

export default function ManageFriends() {
  const { user } = useUser();

  if (!user) {
    return (
      <ErrorPage error={500}>
        Unexpected error. User couldn't be loaded
      </ErrorPage>
    );
  }

  const { friends, outcoming, incoming } = getFriends(
    true,
    user.outcoming,
    user.incoming
  );

  function handleDeleteClick(type: "incoming" | "outcoming") {
    return async function withType(documentId: string) {
      const data = await jsonStrapi("PUT", `/users/${user?.documentId}`, {
        data: { [type]: { disconnect: [documentId] } },
      });
      console.log(data);
    };
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
  handleDeleteClick: (documentId: string) => void;
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
                <User user={user} size={64} showEditButton={false} />
                <button onClick={() => handleDeleteClick(user.documentId)}>
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
