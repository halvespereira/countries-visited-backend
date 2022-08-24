import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { successResponseGenerator } from "../../utils/utils";
import dynamoDb from "aws-sdk/clients/dynamodb";
import User from "../../domain/Countries";

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

const db = new dynamoDb.DocumentClient();

const TableName: string = "countries-visited-table";

export const updateUserHandler: ProxyHandler = async (event: any) => {
  if (event.requestContext.http.method !== "PUT") {
    throw new Error(
      `updateUser Method only accepts POST method, you tried: ${event.requestContext.http.method} method.`
    );
  }
  console.info("put::user::event", event);
  console.info("put-user::event::body", event.body);

  // const body = JSON.parse(event.body);
  const { userId, countries }: User = event.body;

  const params = {
    TableName,
    Key: { userId },
    UpdateExpression: "set #countries = :countries",
    ExpressionAttributeNames: {
      "#countries": "countries",
    },
    ExpressionAttributeValues: {
      ":countries": countries,
    },
  };

  await db.update(params).promise();

  const response = successResponseGenerator(event, event.queryStringParameters);

  console.info(
    `put::user::response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
