import type mongoose from "mongoose"
import { type Models } from "mongoose"
export interface AuthenticateProps {
  email: string
  password: string
}

export interface PersonRequest {
  name: string
  age: number
  email: string
}

export interface IPerson {
  name: string
  age: number
  email: string
}

export interface Model<T> extends Models {
  create: (data: T) => Promise<{ _id: mongoose.Types.ObjectId }>
}
