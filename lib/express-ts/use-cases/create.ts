import type mongoose from "mongoose"
import { type Model } from "../types/types"

const makeCreate = <T>({
  model
}: {
  model: Model<T>
}): ((data: T) => Promise<{ _id: mongoose.Types.ObjectId }>) => {
  const create = async (data: T): Promise<{ _id: mongoose.Types.ObjectId }> => {
    const res = await model.create(data)
    const { _id } = res
    return { _id }
  }
  return create
}
export default makeCreate
