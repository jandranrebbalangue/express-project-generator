import { type Collection } from "mongoose"

const makeList = ({ model }: { model: Collection }) => {
  const list = async () => {
    const res = model.find({})
    return res
  }
  return list
}
export default makeList
