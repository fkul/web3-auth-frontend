import axios from "axios";
import { Nullable, User } from "../types";
import { getUri } from "../utils";

export const postJoin = async (
  socketId: string,
  address: Nullable<string>
): Promise<void> => {
  await axios.post(getUri("/chat/join"), {
    socketId,
    address,
  });
};

export const postMessage = async (from: User, value: string): Promise<void> => {
  await axios.post(getUri("/chat/message"), {
    date: new Date(),
    from,
    value,
  });
};

export const postClear = async (): Promise<void> => {
  await axios.post(getUri("/chat/clear"));
};

export const postLeave = async (user: User): Promise<void> => {
  await axios.post(getUri("/chat/leave"), { user });
};
