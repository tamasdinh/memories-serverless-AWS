import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createMemory } from '../../businessLogic/memoriesLogic'
import { CreateMemoryRequest } from '../../requests/createMemoryRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newMemory: CreateMemoryRequest = JSON.parse(event.body)
  const newItem = await createMemory(newMemory)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: {
        ...newItem
      }
    })
  }

}