import {
  Button,
  HStack,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import React from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
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
      const { data: nonce } = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/api/auth/nonce"
      );

      if (!address || !chain?.id || !nonce) {
        throw new Error("please connect your wallet first");
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Hey! Sign in to up your level!",
        uri: window.location.origin,
        version: "1",
        chainId: chain.id,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/auth/validate",
        {
          message,
          signature,
        }
      );
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

  const getMe = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/api/auth/me"
      );
      setAuthAddress(data);
    } catch (e) {
      console.error(e);
    }
  };

  const signOut = async () => {
    try {
      await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/auth/sign-out"
      );
      setAuthAddress(null);
    } catch (e) {
      console.error(e);
    }
  };

  const join = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/chat/join", {
        socketId,
        address: address ?? authAddress,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const leave = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/chat/leave", {
        user,
      });
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getMe();
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
