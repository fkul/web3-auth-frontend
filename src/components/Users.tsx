import { Heading, Stack } from "@chakra-ui/react";
import { User } from "../types";
import { UserTag } from "./UserTag";

interface Props {
  data: User[];
}

export const Users = ({ data }: Props) => (
  <Stack bg={"whiteAlpha.300"} borderRadius={"md"} p={4} w={"sm"}>
    <Heading>Connected users</Heading>
    {data.map(({ level, displayName }, index) => (
      <UserTag key={index} level={level}>
        {displayName}
      </UserTag>
    ))}
  </Stack>
);
