import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useRef } from "react";
import { Message } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  data: Message[];
}

export const Messages = ({ data }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [data]);

  return (
    <Stack flex={1} bg={"whiteAlpha.100"} borderRadius={"md"} p={4}>
      <Heading>Messages</Heading>
      <Stack ref={ref} overflowY={"scroll"} height={"100%"} p={2}>
        {data.map(({ date, from, value }, index) => (
          <Fragment key={index}>
            {!value.startsWith("/me") ? (
              <Stack bg={"whiteAlpha.100"} borderRadius={"md"} p={2}>
                <Flex justifyContent={"space-between"}>
                  <UserTag level={from.level}>{from.displayName}</UserTag>
                  <Text>{new Date(date).toLocaleTimeString()}</Text>
                </Flex>
                <Text>{value}</Text>
              </Stack>
            ) : (
              <Box fontStyle={"italic"}>
                {value.replace("/me", from.displayName)}
              </Box>
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
