import axios from "axios";
import { SiweMessage } from "siwe";
import { getUri } from "../utils";

export const getNonce = async (): Promise<string> => {
  const { data } = await axios.get(getUri("/auth/nonce"));
  return data;
};

export const postValidate = async (
  message: SiweMessage,
  signature: string
): Promise<void> => {
  await axios.post(getUri("/auth/validate"), {
    message,
    signature,
  });
};

export const getMe = async (): Promise<string> => {
  const { data } = await axios.get(getUri("/auth/me"));
  return data;
};

export const postSignOut = async (): Promise<void> => {
  await axios.post(getUri("/auth/sign-out"));
};
