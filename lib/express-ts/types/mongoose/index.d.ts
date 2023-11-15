declare module "mongoose" {
  interface Model<T> {
    create: (data: T) => Promise<{ _id: string }>
  }
}
