import {
  Button,
  HStack,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { getMe, getNonce, postSignOut, postValidate } from "../api/auth";
import { postJoin, postLeave } from "../api/chat";
import { Nullable, User } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  socketId: string;
  user: Nullable<User>;
}

export const Header = ({ socketId, user }: Props) => {
  const toast = useToast();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [authAddress, setAuthAddress] = React.useState<Nullable<string>>(null);

  const signIn = async () => {
    try {
      const nonce = await getNonce();

      if (!address || !chain?.id || !nonce) {
        throw new Error("please connect your wallet first");
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Hi! Sign in to up your level!",
        uri: window.location.origin,
        version: "1",
        chainId: chain.id,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await postValidate(message, signature);
      setAuthAddress(address);
    } catch (e) {
      toast({
        status: "warning",
        position: "top",
        description: `${e}`,
      });
      console.error(e);
    }
  };

  const getAuthAddress = async () => {
    try {
      setAuthAddress(await getMe());
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    try {
      await postSignOut();
      setAuthAddress(null);
    } catch (e) {
      console.error(e);
    }
  };

  const join = async () => {
    try {
      await postJoin(socketId, address ?? authAddress);
    } catch (e) {
      console.error(e);
    }
  };

  const leave = async () => {
    try {
      user && (await postLeave(user));
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getAuthAddress();
  }, []);

  React.useEffect(() => {
    user && join();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, authAddress]);

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
          <UserTag level={"moderator"} selected={user?.level === "moderator"}>
            moderator
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
        <HStack>
          <Text color={"whiteAlpha.500"}>{authAddress}</Text>
          <Button size={"sm"} onClick={!authAddress ? signIn : signOut}>
            Sign {!authAddress ? `In` : `Out`}
          </Button>
        </HStack>
        <Button size={"sm"} onClick={!user ? join : leave}>
          {!user ? `Join` : `Leave`} Chat
        </Button>
      </VStack>
    </HStack>
  );
};
