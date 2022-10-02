import { Heading, Stack, VStack } from "@chakra-ui/react";
import { User } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  data: User[];
}

export const Users = ({ data }: Props) => (
  <Stack bg={"whiteAlpha.100"} borderRadius={"md"} p={4} w={"md"}>
    <Heading>Users</Heading>
    <VStack alignItems={"flex-start"}>
      {data.map(({ level, displayName }, index) => (
        <UserTag key={index} level={level}>
          {displayName}
        </UserTag>
      ))}
    </VStack>
  </Stack>
);
