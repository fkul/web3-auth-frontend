import React from "react";
import io from "socket.io-client";
import { Container, HStack, Stack } from "@chakra-ui/react";
import { Messages } from "./components/Messages";
import { Message, Nullable, User } from "./types";
import { Users } from "./components/Users";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const socket = io(process.env.REACT_APP_BACKEND_URL ?? "");

const App = () => {
  const [user, setUser] = React.useState<Nullable<User>>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("users", setUsers);
    socket.on("messages", setMessages);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("messages");
    };
  }, []);

  return (
    <Container
      bg={"blue.500"}
      maxW={"container.lg"}
      p={4}
      mt={6}
      borderRadius={"md"}
    >
      <Stack>
        <Header
          socketId={socket.id}
          user={user}
          onJoined={setUser}
          onLeft={() => setUser(null)}
        />
        <HStack height={"60vh"} alignItems={"stretch"}>
          <Messages data={messages} />
          <Users data={users} />
        </HStack>
        <Footer user={user} />
      </Stack>
    </Container>
  );
};

export default App;
