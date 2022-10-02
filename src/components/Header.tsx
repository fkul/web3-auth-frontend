import { Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import React from "react";
import { useAccount } from "wagmi";
import { Nullable, User } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  socketId: string;
  user: Nullable<User>;
}

export const Header = ({ socketId, user }: Props) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();

  const onJoin = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/join", {
        socketId,
        address,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onLeave = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/leave", {
        user,
      });
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    user && onJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <HStack
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
      <VStack alignItems={"flex-end"}>
        {openConnectModal && (
          <Button size={"sm"} onClick={openConnectModal}>
            Connect Wallet
          </Button>
        )}
        {openAccountModal && (
          <Button size={"sm"} onClick={openAccountModal}>
            {address}
          </Button>
        )}
        <Button size={"sm"} onClick={!user ? onJoin : onLeave}>
          {!user ? `Join` : `Leave`} Chat
        </Button>
      </VStack>
    </HStack>
  );
};
