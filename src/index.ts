import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { Routes } from "./routes";
import { failResponseGenerator } from "./utils/utils";

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

/**
 *
 * @param event
 * @returns
 */
export const handler: ProxyHandler = async (event: any) => {
  try {
    console.info("handler::event", event);

    const { http } = event.requestContext;

    const handler = Routes[http.path] ? Routes[http.path][http.method] : null;

    if (handler) {
      return await handler(event);
    } else {
      console.warn("handler::Resource not found");

      return failResponseGenerator(400, "Resource not found");
    }
  } catch (err) {
    console.error("post-property::Error", err);

    return failResponseGenerator(500, err);
  }
};
