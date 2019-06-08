import { Command } from "../types";
import { TextApi, TextState } from "../types/CommandOptions";

export const imageCommand: Command = {
  name: "image",
  buttonProps: { "aria-label": "Add image" },
  execute: (state0: TextState, api: TextApi) => {
    const uploader = api.textArea.parentElement.querySelector("input[type='file']")
    uploader.click()
  },
  keyCommand: "image"
};