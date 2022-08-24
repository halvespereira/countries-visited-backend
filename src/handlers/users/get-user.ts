import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import dynamodb from "aws-sdk/clients/dynamodb";
import User from "../../domain/Countries";
import { successResponseGenerator } from "../../utils/utils";

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

const TableName: string = "countries-visited-table";

const docClient = new dynamodb.DocumentClient();

export const getUserHandler: ProxyHandler = async (event: any, context) => {
  if (event.requestContext.http.method !== "GET") {
    throw new Error(
      `getUserHandler only accept GET method, you tried: ${event.requestContext.http.method}`
    );
  }

  console.info("get-user::event", event);

  const { userId }: User = event.queryStringParameters;

  const userParams = {
    TableName,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const data = await docClient.query(userParams).promise();
  const items = data.Items;

  console.debug("get-user::item", items);

  const response = successResponseGenerator(event, items);

  console.info(
    `get-user::response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
