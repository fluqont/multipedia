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

  const friendsMap = new Map<number, number>();
  for (let i = 0; i < outcomingUsers.length; i++) {
    friendsMap.set(i, OUTCOMING);
  }
  for (let i = 0; i < incomingUsers.length; i++) {
    if (friendsMap.has(i)) {
      friendsMap.set(i, FRIEND);
    } else {
      friendsMap.set(i, INCOMING);
    }
  }

  for (const [i, type] of friendsMap) {
    switch (type) {
      case OUTCOMING:
        outcoming.push(outcomingUsers[i]);
        break;
      case INCOMING:
        incoming.push(incomingUsers[i]);
        break;
      case FRIEND:
        friends.push(outcomingUsers[i]);
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
