import { Model } from "mongoose"

const makeList = <T>({ model }: { model: Model<T> }) => {
  const list = async () => {
    const res = await model.find({})
    return res
  }
  return list
}
export default makeList
