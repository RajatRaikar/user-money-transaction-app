const response = require("../global/response");
const responseHelper = {};

responseHelper.SOMETHING_WENT_WRONG = {
  response_code: response.SOMETHING_WENT_WRONG.response_code,
  response_message: response.SOMETHING_WENT_WRONG.response_message,
  response_data: {},
};

responseHelper.INVALID_TRANSACTION_ID = {
  response_code: response.INVALID_TRANSACTION_ID.response_code,
  response_message: response.INVALID_TRANSACTION_ID.response_message,
  response_data: {},
};

responseHelper.NO_TRANSACTION_DATA = {
  response_code: response.NO_TRANSACTION_DATA.response_code,
  response_message: response.NO_TRANSACTION_DATA.response_message,
  response_data: {},
};

responseHelper.INVALID_INPUT = {
  response_code: response.INVALID_INPUT.response_code,
  response_message: response.INVALID_INPUT.response_message,
  response_data: {},
};

responseHelper.IN_SUFFICIENT_BALANCE = {
  response_code: response.IN_SUFFICIENT_BALANCE.response_code,
  response_message: response.IN_SUFFICIENT_BALANCE.response_message,
  response_data: {},
};

responseHelper.UN_SUCCESSFUL_REFUND = {
  response_code: response.UN_SUCCESSFUL_REFUND.response_code,
  response_message: response.UN_SUCCESSFUL_REFUND.response_message,
  response_data: {},
};

module.exports = responseHelper;
