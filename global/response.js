const response = {};

response.SOMETHING_WENT_WRONG = { response_code: 500, response_message: "Something went wrong" };
response.SUCCESS = { response_code: 200, response_message: "Success" };
response.INVALID_USER_ID = { response_code: 201, response_message: "Invalid user_id" };
response.INVALID_TRANSACTION_ID = { response_code: 202, response_message: "Invalid transaction_id" };
response.NO_TRANSACTION_DATA = { response_code: 203, response_message: "No transaction data" };
response.INVALID_INPUT = { response_code: 204, response_message: "Invalid input" };
response.IN_SUFFICIENT_BALANCE = { response_code: 205, response_message: "Insufficient balance" };
response.UN_SUCCESSFUL_REFUND = { response_code: 206, response_message: "unsuccessful refund" };


module.exports = response;