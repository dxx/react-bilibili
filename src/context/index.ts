import * as React from "react";

export const context = {
  picURL: process.env.URL_PREFIX + "/transfer/image",
  videoURL: process.env.URL_PREFIX + "/transfer/mp4"
};

export default React.createContext(context);
