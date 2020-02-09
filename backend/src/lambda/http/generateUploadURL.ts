import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getSignedUrl } from '../../businessLogic/memoriesLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { memoryId } = event.pathParameters
  const signedURL = getSignedUrl(memoryId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadURL: signedURL
    })
  }
}