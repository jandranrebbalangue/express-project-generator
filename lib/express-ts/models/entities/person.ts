import mongoose, { InferSchemaType } from "mongoose"
import { IPerson } from "../../types/types"

const personSchema = new mongoose.Schema<IPerson>(
  {
    name: { type: String },
    age: { type: Number },
    email: { type: String }
  },
  {
    timestamps: true
  }
)

export type PersonProps = InferSchemaType<typeof personSchema>

personSchema.pre("updateOne", async function updateOne(next) {
  const docToUpdate = await this.model.findOne(this.getQuery())
  docToUpdate.set({ modifiedTime: new Date().toISOString() })
  await docToUpdate.save()
  next()
})

const Person = mongoose.model<PersonProps>("Person", personSchema)

export default Person
