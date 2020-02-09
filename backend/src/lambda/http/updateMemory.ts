import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateMemoryRequest } from '../../requests/UpdateMemoryRequest'
import { updateMemory } from '../../businessLogic/memoriesLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const id = event.pathParameters.id.split('-')
  const userId = id[0]
  const timeStamp = id[1]
  const updatedMemory: UpdateMemoryRequest = JSON.parse(event.body)

  await updateMemory(userId, timeStamp, updatedMemory)

  return {
    statusCode: 201,
    body: ""
  }
}