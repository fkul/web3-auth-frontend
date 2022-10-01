import { Box, Button, HStack, Input } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Nullable, User } from "../types";

interface Props {
  user: Nullable<User>;
}

export const Footer = ({ user }: Props) => {
  const [messageValue, setMessageValue] = React.useState<string>("");

  const onSend = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/message", {
        date: new Date(),
        from: user,
        value: messageValue,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box bg={"whiteAlpha.100"} borderRadius={"md"} p={4}>
      <HStack
        as={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
          setMessageValue("");
        }}
      >
        <Input
          name={"message"}
          value={messageValue}
          onChange={({ target }) => setMessageValue(target.value)}
          disabled={!user}
          autoComplete={"off"}
        />
        <Button type={"submit"} disabled={!user || messageValue.length === 0}>
          SEND
        </Button>
      </HStack>
    </Box>
  );
};
