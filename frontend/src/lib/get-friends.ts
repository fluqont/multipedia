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

  const friendsMap = new Map<MinimalUser, number>();
  for (let i = 0; i < outcomingUsers.length; i++) {
    friendsMap.set(outcomingUsers[i], OUTCOMING);
  }
  for (let i = 0; i < incomingUsers.length; i++) {
    if (friendsMap.has(incomingUsers[i])) {
      friendsMap.set(incomingUsers[i], FRIEND);
    } else {
      friendsMap.set(incomingUsers[i], INCOMING);
    }
  }

  for (const [user, type] of friendsMap) {
    switch (type) {
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
