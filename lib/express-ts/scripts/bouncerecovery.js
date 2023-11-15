require("dotenv").config()
const csvtojsonV2 = require("csvtojson")
const jwt = require("jsonwebtoken")
const fs = require("fs/promises")
const dayjs = require("dayjs")
const axios = require("axios").default

const email = process.env.LOGIN_USERNAME
const password = process.env.LOGIN_PASSWORD
const apiEndpoint = process.env.API_ENDPOINT

async function storeToken(tokenContainer) {
  try {
    await fs.writeFile("token.txt", JSON.stringify(tokenContainer))
  } catch (error) {
    console.error("Error storing token:", error)
  }
}

async function getStoredToken() {
  try {
    const tokenContainer = await fs.readFile("token.txt", "utf-8")
    return JSON.parse(tokenContainer)
  } catch (error) {
    return null
  }
}

async function getAccessToken() {
  const tokenContainer = await getStoredToken()

  if (!tokenContainer || isTokenExpired(tokenContainer)) {
    const newTokenContainer = await requestNewToken()
    if (newTokenContainer) {
      await storeToken(newTokenContainer)
      return newTokenContainer.message
    } else {
      console.error("Failed to obtain or refresh access token")
      return null
    }
  }

  return tokenContainer.message
}

async function requestNewToken() {
  const authResponse = await fetch(`${apiEndpoint}/MMS/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  if (authResponse.ok) {
    const tokenData = await authResponse.json()
    return { message: tokenData.message }
  } else {
    console.error("Failed to obtain access token")
    return null
  }
}

function isTokenExpired(tokenContainer) {
  const decodedToken = decodeToken(tokenContainer)
  if (!decodedToken) {
    return true
  }
  return false
}

function decodeToken(tokenContainer) {
  try {
    if (!tokenContainer || !tokenContainer.message) {
      console.error("Token not available for decoding")
      return null
    }

    const token = tokenContainer.message
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.error("Error decoding JWT token:", error.message)
    return null
  }
}

async function postData(data) {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    console.error("Exiting: Cannot proceed without a valid access token")
    return
  }
  try {
    const post = await axios.post(`${apiEndpoint}/MMS/bounce_recovery`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    })
    return post.data
  } catch (error) {
    console.log("Error fetch post data", error.message)
  }
}

async function main() {
  const proms = []

  const previousDate = dayjs().subtract(1, "day").format("YYYY-MM-DD")
  const jsonArr = await csvtojsonV2().fromFile(`../csv/${previousDate}.csv`)
  jsonArr.forEach((data) => {
    proms.push(postData(data))
  })

  await Promise.all(proms)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const maxRetries = 3
const retryDelay = 5 * 60 * 1000

async function runScriptWithRetry() {
  let retries = 0

  while (retries < maxRetries) {
    try {
      await main()
      console.log("Script completed successfully")
      break
    } catch (error) {
      console.error(`Error during script execution: ${error.message}`)
      console.log(
        `Retrying in ${retryDelay / 1000} seconds... (Attempt ${retries + 1
        }/${maxRetries})`
      )
      await delay(retryDelay)
      retries++
    }
  }

  if (retries === maxRetries) {
    console.error(`Max retries reached. Script failed.`)
  }
}
runScriptWithRetry()
