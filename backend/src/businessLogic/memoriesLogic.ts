import { memoriesDBAccess } from '../dataLayer/memoriesDBAccess'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CreateMemoryRequest } from '../requests/createMemoryRequest'
import { UpdateMemoryRequest } from '../requests/UpdateMemoryRequest'

const DB = new memoriesDBAccess()

export async function getMemories (userID: string): Promise<DocumentClient.AttributeMap[]> {
  return await DB.getMemories(userID)
}

export async function createMemory (memoryItem: CreateMemoryRequest): Promise<CreateMemoryRequest> {

  memoryItem.timeStamp = Date.now().toString()
  
  await DB.createMemory(memoryItem)
  return memoryItem
}

export async function updateMemory (userID: string, timeStamp: string, updatedMemory: UpdateMemoryRequest): Promise<void> {
  return await DB.updateMemory(userID, timeStamp, updatedMemory)
}

export async function deleteMemory (userID: string, timeStamp: string): Promise<void> {
  return await DB.deleteMemory(userID, timeStamp)
}