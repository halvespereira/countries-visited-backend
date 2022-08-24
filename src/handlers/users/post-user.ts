import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import dynamodb from "aws-sdk/clients/dynamodb";
import User from "../../domain/Countries";
import { successResponseGenerator } from "../../utils/utils";

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

const db = new dynamodb.DocumentClient();

const tableName: string = "countries-visited-table";

export const postUserHandler: ProxyHandler = async (event: any) => {
  try {
    if (event.requestContext.http.method !== "POST") {
      throw new Error(
        `postUser Method only accepts POST method, you tried: ${event.requestContext.http.method} method.`
      );
    }
    console.info("post-user::event", event);
    console.info("post-user::event::body", event.body);

    // const body = JSON.parse(event.body);

    const { countries, userId }: User = event.body;

    const Item: User = {
      userId,
      countries,
    };

    const params = {
      TableName: tableName,
      Item,
    };

    await db.put(params).promise();

    const response = successResponseGenerator(event, Item);

    console.info(
      `post-user::response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
  } catch (err) {
    console.error("post-user::Error", err);

    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
