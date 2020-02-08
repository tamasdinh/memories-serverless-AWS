import { memoriesDBAccess } from '../dataLayer/memoriesDBAccess'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const DB = new memoriesDBAccess()

export async function getMemories (userID: string): Promise<DocumentClient.AttributeMap[]> {
  return await DB.getMemories(userID)
}