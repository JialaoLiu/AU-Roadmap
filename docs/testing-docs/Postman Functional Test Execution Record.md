# Postman Functional Test Execution Record

## 1. Document Overview

This document records the detailed Postman functional testing process for the AU Roadmap project. It includes:

- request purpose
- request configuration
- key Postman test scripts
- execution process
- expected result
- actual result
- test conclusion

## 2. Test Environment

- Tool: Postman Desktop
- Collection: `AU Roadmap API Tests`
- Environment: `AU Roadmap Local`
- Base URL: `http://localhost:8080/api`
- Test date: 9 May 2026
- Authentication method for protected routes: valid local JWT tokens configured in Postman environment variables

Environment variables used:

- `baseUrl`
- `studentToken`
- `adminToken`

## 3. Common Execution Process

For each request, the following general process was used:

1. Import the Postman collection `tests/api/au-roadmap.postman_collection.json`
2. Import the environment `tests/api/au-roadmap.local.postman_environment.json`
3. Select the `AU Roadmap Local` environment
4. Start the local backend server
5. For protected routes, configure `studentToken` and `adminToken`
6. Open the target request in Postman
7. Click `Send`
8. Verify:
   - HTTP status code
   - returned JSON structure
   - whether the embedded Postman test script conditions passed

## 4. Detailed Test Records

### 4.1 Test Case 1: Health Check

**Purpose**  
To verify that the backend server is running and the health endpoint responds successfully.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/health`
- Headers: none
- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Health status is ok', function () { pm.expect(json.status).to.eql('ok'); });
```

**Execution Process**

1. Open `Public APIs -> Health Check`
2. Click `Send`
3. Observe response code and JSON body

**Expected Result**

- HTTP `200 OK`
- response contains `"status": "ok"`

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "status": "ok",
  "timestamp": "2026-05-09T07:53:24.949Z"
}
```

**Conclusion**  
Passed.

---

### 4.2 Test Case 2: List Programs

**Purpose**  
To verify that the system can return a paginated list of programs successfully.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/programs?page=1&limit=5`
- Headers: none
- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Programs response is successful', function () { pm.expect(json.success).to.eql(true); });
pm.test('Programs array exists', function () { pm.expect(json.data).to.be.an('array'); });
```

**Execution Process**

1. Open `Public APIs -> List Programs`
2. Click `Send`
3. Check status and array payload

**Expected Result**

- HTTP `200 OK`
- `success` is `true`
- `data` contains a program array

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "code": "XBACC",
      "name": "Bachelor of Accounting"
    }
  ]
}
```

**Conclusion**  
Passed.

---

### 4.3 Test Case 3: Program Roadmap

**Purpose**  
To verify that roadmap data for program `3` can be retrieved successfully.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/programs/3/roadmap`
- Headers: none
- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Roadmap payload exists', function () { pm.expect(json.data.roadmap).to.exist; });
```

**Execution Process**

1. Open `Public APIs -> Program Roadmap`
2. Click `Send`
3. Check whether roadmap content exists

**Expected Result**

- HTTP `200 OK`
- roadmap content exists in `json.data.roadmap`

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": {
    "program": {
      "id": 3,
      "code": "MIT",
      "name": "Master of Information Technology"
    },
    "roadmap": [
      {
        "year": 1
      }
    ]
  }
}
```

**Conclusion**  
Passed.

---

### 4.4 Test Case 4: Search Programs

**Purpose**  
To verify that keyword-based search works correctly for programs.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/search?q=computer&type=programs&limit=5`
- Headers: none
- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Search response is successful', function () { pm.expect(json.success).to.eql(true); });
```

**Execution Process**

1. Open `Public APIs -> Search Programs`
2. Click `Send`
3. Verify search results are returned

**Expected Result**

- HTTP `200 OK`
- `success` is `true`

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": 1,
        "code": "BCOMP",
        "name": "Bachelor of Computer Science"
      }
    ],
    "total": 3
  }
}
```

**Conclusion**  
Passed.

---

### 4.5 Test Case 5: Get Current User

**Purpose**  
To verify that a valid student token can access the authenticated user endpoint.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/auth/me`
- Header:

```text
Authorization: Bearer {{studentToken}}
```

- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Authenticated user response is successful', function () { pm.expect(json.success).to.eql(true); });
```

**Execution Process**

1. Ensure `studentToken` is configured in the environment
2. Open `Student Protected APIs -> Get Current User`
3. Click `Send`
4. Verify authenticated user data is returned

**Expected Result**

- HTTP `200 OK`
- authenticated student profile returned

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "Jialao",
    "last_name": "Liu",
    "email": "jialaoliu@adelaide.edu.au",
    "role": "student"
  }
}
```

**Conclusion**  
Passed.

---

### 4.6 Test Case 6: List Connections

**Purpose**  
To verify that an authenticated student can access their community connections list.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/community/connections`
- Header:

```text
Authorization: Bearer {{studentToken}}
```

- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Connections response is successful', function () { pm.expect(json.success).to.eql(true); });
```

**Execution Process**

1. Ensure `studentToken` is configured
2. Open `Student Protected APIs -> List Connections`
3. Click `Send`
4. Verify list of connections is returned

**Expected Result**

- HTTP `200 OK`
- `success` is `true`

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": [
    {
      "connection_id": 1,
      "status": "accepted",
      "first_name": "Rhaneela",
      "last_name": "Punitham"
    }
  ]
}
```

**Conclusion**  
Passed.

---

### 4.7 Test Case 7: Discussion Validation Check

**Purpose**  
To verify that invalid discussion input is rejected with a controlled validation error.

**Request Configuration**

- Method: `POST`
- URL: `{{baseUrl}}/discussions/create`
- Headers:

```text
Authorization: Bearer {{studentToken}}
Content-Type: application/json
```

- Body:

```json
{
  "title": "",
  "content": ""
}
```

**Key Postman Test Script**

```javascript
pm.test('Status is 400', function () { pm.response.to.have.status(400); });
const json = pm.response.json();
pm.test('Validation failure is returned', function () { pm.expect(json.success).to.eql(false); });
```

**Execution Process**

1. Ensure `studentToken` is configured
2. Open `Student Protected APIs -> Discussion Validation Check`
3. Send empty title and content
4. Verify validation error is returned

**Expected Result**

- HTTP `400 Bad Request`
- validation error returned

**Actual Result**

- Status: `400 Bad Request`
- Response excerpt:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

**Conclusion**  
Passed.

---

### 4.8 Test Case 8: Admin Stats

**Purpose**  
To verify that an authenticated admin can access admin dashboard summary statistics.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/admin/stats`
- Header:

```text
Authorization: Bearer {{adminToken}}
```

- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Admin stats response is successful', function () { pm.expect(json.success).to.eql(true); });
```

**Execution Process**

1. Ensure `adminToken` is configured
2. Open `Admin Protected APIs -> Admin Stats`
3. Click `Send`
4. Verify summary values are returned

**Expected Result**

- HTTP `200 OK`
- `success` is `true`

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": {
    "programs": 26,
    "courses": 70,
    "users": 12,
    "resources": 6
  }
}
```

**Conclusion**  
Passed.

---

### 4.9 Test Case 9: List Courses

**Purpose**  
To verify that an authenticated admin can retrieve the course list successfully.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/admin/courses`
- Header:

```text
Authorization: Bearer {{adminToken}}
```

- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 200', function () { pm.response.to.have.status(200); });
const json = pm.response.json();
pm.test('Courses response is successful', function () { pm.expect(json.success).to.eql(true); });
```

**Execution Process**

1. Ensure `adminToken` is configured
2. Open `Admin Protected APIs -> List Courses`
3. Click `Send`
4. Verify course list is returned

**Expected Result**

- HTTP `200 OK`
- `success` is `true`
- course array returned

**Actual Result**

- Status: `200 OK`
- Response excerpt:

```json
{
  "success": true,
  "data": [
    {
      "id": 25,
      "code": "ACCT 1000",
      "name": "Accounting for Decision Makers"
    }
  ]
}
```

**Conclusion**  
Passed.

---

### 4.10 Test Case 10: Unauthorized /auth/me

**Purpose**  
To verify that the system correctly blocks unauthenticated access.

**Request Configuration**

- Method: `GET`
- URL: `{{baseUrl}}/auth/me`
- Headers: none
- Body: none

**Key Postman Test Script**

```javascript
pm.test('Status is 401', function () { pm.response.to.have.status(401); });
const json = pm.response.json();
pm.test('Unauthorized response is unsuccessful', function () { pm.expect(json.success).to.eql(false); });
```

**Execution Process**

1. Open `Negative Checks -> Unauthorized /auth/me`
2. Send the request without any token
3. Verify the request is rejected

**Expected Result**

- HTTP `401 Unauthorized`
- authentication error returned

**Actual Result**

- Status: `401 Unauthorized`
- Response excerpt:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**Conclusion**  
Passed.

---

## 5. Final Summary

All Postman test cases prepared in the functional API test collection were executed successfully.

### 5.1 Overall Result

- Total Postman test cases executed: `10`
- Passed: `10`
- Failed: `0`

### 5.2 Key Findings

- public endpoints responded correctly
- authenticated student endpoints responded correctly
- authenticated admin endpoints responded correctly
- validation failure returned controlled `400 Bad Request`
- unauthorized access returned controlled `401 Unauthorized`

## 6. Related Files

- `tests/api/au-roadmap.postman_collection.json`
- `tests/api/au-roadmap.local.postman_environment.json`
- `tests/api/smoke_test.py`
- `docs/API and Performance Testing Summary.md`
- `docs/System Testing and Evaluation Report.md`
