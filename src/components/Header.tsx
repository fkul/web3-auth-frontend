import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Nullable, User } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  socketId: string;
  user: Nullable<User>;
  onJoined: (user: User) => void;
  onLeft: () => void;
}

export const Header = ({ socketId, user, onJoined, onLeft }: Props) => {
  const onJoin = async () => {
    try {
      const { data } = await axios.post<User>(
        process.env.REACT_APP_BACKEND_URL + "/join",
        {
          socketId,
        }
      );
      onJoined(data);
    } catch (e) {
      console.error(e);
    }
  };

  const onLeave = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/leave", {
        user,
      });
      onLeft();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex
      bg={"whiteAlpha.100"}
      borderRadius={"md"}
      p={4}
      justifyContent={"space-between"}
    >
      <Stack>
        <HStack>
          <Text fontWeight={"bold"}>Your display name:</Text>
          <Text>{user && user.displayName}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={"bold"}>Your level:</Text>
          <UserTag level={"anonymous"} selected={user?.level === "anonymous"}>
            anonymous
          </UserTag>
          <UserTag level={"connected"} selected={user?.level === "connected"}>
            connected
          </UserTag>
          <UserTag
            level={"authenticated"}
            selected={user?.level === "authenticated"}
          >
            authenticated
          </UserTag>
          <UserTag level={"vip"} selected={user?.level === "vip"}>
            vip
          </UserTag>
        </HStack>
      </Stack>
      <ButtonGroup>
        <Button onClick={!user ? onJoin : onLeave}>
          {!user ? `Join` : `Leave`} Chat
        </Button>
        <Button>Connect Wallet</Button>
      </ButtonGroup>
    </Flex>
  );
};
