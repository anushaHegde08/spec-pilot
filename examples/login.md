## User Login

- POST /login accepts email and password
- Validate that email and password are not empty
- Return a JWT token if credentials are correct
- Return 401 error if credentials are wrong
- Hash passwords using bcrypt before comparing
