import { Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Message } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  data: Message[];
}

export const Messages = ({ data }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data]);

  return (
    <Stack flex={1} bg={"whiteAlpha.100"} borderRadius={"md"} p={4}>
      <Heading>Messages</Heading>
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
