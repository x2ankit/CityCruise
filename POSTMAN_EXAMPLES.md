# Postman / cURL Examples - CityCruise Backend

Below are quick curl examples to test core endpoints locally (assumes backend running at http://localhost:4001)

## Health

curl -s http://localhost:4001/health | jq

## Register (email/password)

curl -X POST http://localhost:4001/users/register \
 -H "Content-Type: application/json" \
 -d '{ "fullname": { "firstname": "Test", "lastname": "User" }, "email": "test@example.com", "password": "password123" }'

## Login (email/password)

curl -X POST http://localhost:4001/users/login \
 -H "Content-Type: application/json" \
 -d '{ "email": "test@example.com", "password": "password123" }' \
 -i

## Logout

curl -X POST http://localhost:4001/users/logout -i

## Google sign-in (send ID token obtained from client)

curl -X POST http://localhost:4001/auth/google \
 -H "Content-Type: application/json" \
 -d '{ "idToken": "<GOOGLE_ID_TOKEN>", "role": "user" }'

Replace values where needed. If you're testing locally and using cookies, the CLI calls above will not preserve cookies between calls unless you use curl options to store cookies (`-c cookiejar -b cookiejar`).
