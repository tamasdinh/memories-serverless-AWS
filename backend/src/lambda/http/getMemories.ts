import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getMemories } from '../../businessLogic/memoriesLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userID = event.pathParameters.userId

  const response = await getMemories(userID)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: response
    }) 
  }

}