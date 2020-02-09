import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteMemory } from '../../businessLogic/memoriesLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const id = event.pathParameters.id.split('-')
  console.log('id:', id)
  const userID = id[0]
  const timeStamp = id[1]
  console.log('userID:', userID)
  console.log('timeStamp:', timeStamp)

  await deleteMemory(userID, timeStamp)

  return {
    statusCode: 201,
    body: ""
  }
}