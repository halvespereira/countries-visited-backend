export function getOrigin(event: any) {
  return event.headers?.origin || "http://localhost:3000";
}

export function successResponseGenerator(event: any, body?: any) {
  const allowedOrigins = ["http://localhost:3000"];

  let response: any = {
    statusCode: 200,
    body: body ? JSON.stringify(body) : "Success",
  };

  const origin = getOrigin(event);

  if (allowedOrigins.includes(origin)) {
    response.headers = {
      "Access-Control-Allow-Origin": origin,
    };
  }

  return response;
}

export function failResponseGenerator(statusCode: number, body?: any) {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : "Request failed.",
  };
}
