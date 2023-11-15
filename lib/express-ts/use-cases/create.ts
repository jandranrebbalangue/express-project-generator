import { Model } from "mongoose"

const makeCreate = <T>({ model }: { model: Model<T> }) => {
  const create = async (data: T) => {
    const res = await model.create(data)
    const { _id } = res
    return { _id }
  }
  return create
}
export default makeCreate
