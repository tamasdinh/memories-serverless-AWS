import { apiEndpoint } from '../config'
import { MemoryItem } from '../../../backend/src/models/memoryItem';
import { CreateMemoryRequest } from '../../../backend/src/requests/createMemoryRequest';
import Axios, { AxiosResponse } from 'axios'
import { UpdateMemoryRequest } from '../../../backend/src/requests/UpdateMemoryRequest';
import { decode } from 'jsonwebtoken'
import { Jwt } from '../../../backend/src/auth/Jwt'

export async function getMemories(idToken: string): Promise<MemoryItem[]> {

  const jwt = decode(idToken, { complete: true }) as Jwt
  const userID = jwt.payload.sub

  const response = await Axios.get(`${apiEndpoint}/memories`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  })
  return response.data.items
}

export async function createMemory(
  idToken: string,
  newMemory: CreateMemoryRequest
): Promise<MemoryItem> {
  const response = await Axios.post(`${apiEndpoint}/new`,  JSON.stringify(newMemory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function updateMemory(
  idToken: string,
  timeStamp: string,
  updatedMemory: UpdateMemoryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/update/${timeStamp}`, JSON.stringify(updatedMemory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMemory(
  idToken: string,
  timeStamp: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/delete/${timeStamp}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  timeStamp: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/image/${timeStamp}`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadURL
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
