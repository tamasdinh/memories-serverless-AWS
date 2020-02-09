import { memoriesDBAccess } from '../dataLayer/memoriesDBAccess'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CreateMemoryRequest } from '../requests/createMemoryRequest'
import { UpdateMemoryRequest } from '../requests/UpdateMemoryRequest'
import { MemoriesS3Access } from '../dataLayer/memoriesS3Access'
import { MemoryItem } from '../models/memoryItem'

const DB = new memoriesDBAccess()
const S3 = new MemoriesS3Access()

export async function getMemories (userID: string): Promise<DocumentClient.AttributeMap[]> {
  return await DB.getMemories(userID)
}

export async function createMemory (userID: string, memoryItem: CreateMemoryRequest): Promise<CreateMemoryRequest> {

  let newItem: MemoryItem = {
    ...memoryItem,
    userId: userID,
    timeStamp: Date.now().toString(),
    revisited: false
  }
  
  await DB.createMemory(newItem)
  return newItem
}

export async function updateMemory (userID: string, timeStamp: string, updatedMemory: UpdateMemoryRequest): Promise<void> {
  return await DB.updateMemory(userID, timeStamp, updatedMemory)
}

export async function deleteMemory (userID: string, timeStamp: string): Promise<void> {
  return await DB.deleteMemory(userID, timeStamp)
}

export function getSignedUrl (userID: string, timeStamp: string): string {
  return S3.getSignedUrl(userID, timeStamp)
}