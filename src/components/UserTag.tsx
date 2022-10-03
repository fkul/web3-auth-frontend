import { Tag, TagProps } from "@chakra-ui/react";
import { UserLevel } from "../types";

const levelColors: Record<UserLevel, string> = {
  anonymous: "gray",
  connected: "purple",
  authenticated: "green",
  moderator: "yellow",
};

interface Props extends TagProps {
  level: UserLevel;
  selected?: boolean;
}

export const UserTag = ({ children, level, selected = false }: Props) => (
  <Tag
    colorScheme={levelColors[level]}
    outlineColor={selected ? "teal.200" : "transparent"}
  >
    {children}
  </Tag>
);
