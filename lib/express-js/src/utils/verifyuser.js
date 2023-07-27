export function verifyUser(req, secretKey) {
  const username = req.body.email
  const password = req.body.password
  let response

  try {
    if (
      username === process.env.USERNAME &&
      password === process.env.PASSWORD
    ) {
      response = {
        data: {
          username: username
        }
      }

      if (response.hasOwnProperty("data") && response.data) {
        response = response.data
      }

      return {
        success: true,
        message: jwt.sign({ user: response }, secretKey)
      }
    }
  } catch (error) {
    console.log(error)
  }
  return { success: false, message: "Invalid credentials" }
}
