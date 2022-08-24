import { postUserHandler } from "./handlers/users/post-user";
import { getUserHandler } from "./handlers/users/get-user";
import { updateUserHandler } from "./handlers/users/update-user";

/**
 * Application routes
 */
export const Routes: { [index: string]: { [index: string]: any } } = {
  "/countries": {
    POST: postUserHandler,
    GET: getUserHandler,
    PUT: updateUserHandler,
  },
};
