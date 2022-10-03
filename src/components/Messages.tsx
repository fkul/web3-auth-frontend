import {
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Message } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  data: Message[];
}

export const Messages = ({ data }: Props) => {
  const toast = useToast();
  const ref = React.useRef<HTMLDivElement>(null);

  const clearChat = async () => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/chat/clear");
    } catch (e) {
      toast({
        status: "warning",
        position: "top",
        description: `${e}`,
      });
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data]);

  return (
    <Stack flex={1} bg={"whiteAlpha.100"} borderRadius={"md"} p={4}>
      <Flex justifyContent={"space-between"}>
        <Heading>Messages</Heading>
        <Button size={"xs"} onClick={clearChat}>
          Clear chat
        </Button>
      </Flex>
      <Stack ref={ref} overflowY={"scroll"} height={"100%"} p={2}>
        {data.map(({ date, from, value }, index) => (
          <React.Fragment key={index}>
            {!value.startsWith("/me") ? (
              <Stack bg={"whiteAlpha.100"} borderRadius={"md"} p={2}>
                <Flex justifyContent={"space-between"}>
                  <UserTag level={from.level}>{from.displayName}</UserTag>
                  <Text>{new Date(date).toLocaleTimeString()}</Text>
                </Flex>
                <Text>{value}</Text>
              </Stack>
            ) : (
              <HStack fontStyle={"italic"} spacing={1}>
                <Text color={"whiteAlpha.500"}>{from.displayName}</Text>
                <Text>{value.replace("/me", "")}</Text>
              </HStack>
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
