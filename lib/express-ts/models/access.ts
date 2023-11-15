import mongoose, { connect, type Mongoose } from "mongoose"
import debug from "debug"

const log = debug("mongodb")

let conn: Mongoose | null = null
export const mongoConnect = async (): Promise<Mongoose> => {
  if (conn !== null) {
    log("Reusing DB client")
    return conn
  }

  const { MONGO_URL } = process.env
  log("MONGO_URL:", MONGO_URL)

  try {
    log("Creating new DB client")
    conn = await connect(MONGO_URL as string, {
      serverSelectionTimeoutMS: 15000
    })
    log("Connected", conn)

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await Promise.resolve(conn)

    // create index
    // await createIndex({ name: 1 }, { unique: true });
  } catch (err) {
    log(err)
    throw err
  }

  return conn
}

export const mongoDisconnect = async (): Promise<void> => {
  if (conn != null) await mongoose.connection.close()
  conn = null
  log("DB disconnected")
}
