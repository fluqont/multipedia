import { MinimalUser } from "../types/user";

type NullableUsers = MinimalUser[] | false | null;

export function getFriends(
  outcomingUsers?: NullableUsers,
  incomingUsers?: NullableUsers
) {
  const friends: MinimalUser[] = [],
    outcoming: MinimalUser[] = [],
    incoming: MinimalUser[] = [];
  if (!outcomingUsers || !incomingUsers) {
    return { friends, outcoming, incoming };
  }

  const OUTCOMING = 1,
    INCOMING = 0,
    FRIEND = 2;

  const friendsMap = new Map<string, MinimalUser & { type: number }>();
  for (let i = 0; i < outcomingUsers.length; i++) {
    friendsMap.set(outcomingUsers[i].username, {
      ...outcomingUsers[i],
      type: OUTCOMING,
    });
  }
  for (let i = 0; i < incomingUsers.length; i++) {
    if (friendsMap.has(incomingUsers[i].username)) {
      friendsMap.set(incomingUsers[i].username, {
        ...incomingUsers[i],
        type: FRIEND,
      });
    } else {
      friendsMap.set(incomingUsers[i].username, {
        ...incomingUsers[i],
        type: INCOMING,
      });
    }
  }

  for (const [, user] of friendsMap) {
    switch (user.type) {
      case OUTCOMING:
        outcoming.push(user);
        break;
      case INCOMING:
        incoming.push(user);
        break;
      case FRIEND:
        friends.push(user);
        break;
    }
  }

  return { friends, outcoming, incoming };
}

export function getFriendshipStatus(
  userId: number,
  relations: ReturnType<typeof getFriends>
) {
  if (relations.friends.findIndex((user) => user.id === userId) !== -1) {
    return "friend";
  } else if (
    relations.incoming.findIndex((user) => user.id === userId) !== -1
  ) {
    return "accept friend request";
  } else if (
    relations.outcoming.findIndex((user) => user.id === userId) !== -1
  ) {
    return "cancel friend request";
  } else {
    return "send friend request";
  }
}
