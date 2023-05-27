// LOAD PACKAGES
const express = require("express");
require("dotenv").config();
const nodeCache = require("node-cache");
const { v4 } = require('uuid');

// LOAD FILE
const response = require("./global/response");
const constant = require("./global/constant");
const transactionLib = require("./db/library/transaction.lib");
const validatorHelper = require("./helperLib/validatorHelper");
const userLib = require("./db/library/user.lib");
const responseHelper = require("./helperLib/responseHelper");

// CREATE APP
const app = express();
const server = require('http').createServer(app);

// SOCKET INITILIZE
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("user is connected");
  const { user_id } = socket.handshake.query;
  await userLib.updateConnectionId(user_id, socket.id);

  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

app.use(express.urlencoded({ extended:true }));
const cache = new nodeCache();

// FETCH: transaction data from id
app.get("/api/fetchTransaction", async (req, res) => {
  try {
    if (!req.query.transaction_id) return res.json(responseHelper.INVALID_TRANSACTION_ID);

    let transactionData;
    transactionData = cache.has(req.query.transaction_id) ? cache.get(req.query.transaction_id): await transactionLib.findOne( req.query.transaction_id);

    if (!transactionData) return res.json(responseHelper.INVALID_TRANSACTION_ID);

    cache.set(req.query.transaction_id, transactionData, 60);

    return res.json({
      response_code: response.SUCCESS.response_code,
      response_message: response.SUCCESS.response_message,
      response_data: {
        transaction_id: transactionData.transactionId,
        details: transactionData.details,
        amount: transactionData.amount,
        sender_id: transactionData.senderId,
        receiver_id: transactionData.receiverId,
      },
    });
  } catch (e) {
    return res.json(responseHelper.SOMETHING_WENT_WRONG);
  }
});

// FETCH: all transaction data
app.get("/api/fetch/allTransaction", async (req, res) => {
  try {
    const transactionData = await transactionLib.find();

    if (!transactionData.length) return res.json(responseHelper.NO_TRANSACTION_DATA);

    return res.json({
      response_code: response.SUCCESS.response_code,
      response_message: response.SUCCESS.response_message,
      response_data: transactionData.map(data => {
        return {
          transaction_id: data.transactionId,
          details: data.details,
          amount: data.amount,
          sender_id: data.senderId,
          receiver_id: data.receiverId,
        };
      }),
    });
  } catch (e) {
    return res.json(responseHelper.SOMETHING_WENT_WRONG);
  }
});

// CREATE: create a new transaction
app.post("/api/createTransaction", async (req, res) => {
  try {
    // validate inputs
    const isValideInput = validatorHelper.inputValidator(req.body.sender_id, req.body.receiver_id, req.body.amount, req.body.details);
    if(!isValideInput) return res.json(responseHelper.INVALID_INPUT);

    const isValidParties = await validatorHelper.validateBothParties(req.body.sender_id, req.body.receiver_id);
    if(!isValidParties.status) {
      return res.json({
        response_code: response.INVALID_INPUT.response_code,
        response_message: response.INVALID_INPUT.response_message,
        response_data: {
          data: isValidParties.reason
        },
      });
    }

    if(isValidParties.user_data.sender_data.balance < req.body.amount) return res.json(responseHelper.IN_SUFFICIENT_BALANCE);

    const isValueUpdated = await userLib.update({
      id: isValidParties.user_data.sender_data.id,
      balance: { $gte: req.body.amount }
    }, {
      $set: { balance: isValidParties.user_data.sender_data.balance - parseInt(req.body.amount) },
    }
    );

    if(isValueUpdated.modifiedCount == constant.ACTIVE) {
      await Promise.all([
        transactionLib.create({ transactionId: v4() + `-${ Date.now() }`, details: req.body.details, amount: req.body.amount, senderId: req.body.sender_id, receiverId: req.body.receiver_id}),
        userLib.update({
          id: isValidParties.user_data.receiver_data.id,
        }, {
          $set: { balance: isValidParties.user_data.receiver_data.balance + parseInt(req.body.amount) },
        })
      ]);

      io.to(isValidParties.user_data.sender_data.connectionId).emit(constant.MONEY_TRANSFERRED);
      io.to(isValidParties.user_data.receiver_data.connectionId).emit(constant.MONEY_RECEIVED);

      return res.json({
        response_code: response.SUCCESS.response_code,
        response_message: response.SUCCESS.response_message,
        response_data: {
          sender_id: isValidParties.user_data.sender_data.id,
          receiver_id: isValidParties.user_data.receiver_data.id,
          amount: req.body.amount
        },
      });
    }

    return res.json(responseHelper.IN_SUFFICIENT_BALANCE);
  } catch (e) {
    console.log(e);
    return res.json(responseHelper.SOMETHING_WENT_WRONG);
  }
});

// DETELE: reverse the transaction
app.delete("/api/reverseTransaction", async (req, res) => {
  try {
    if (!req.body.transaction_id) return res.json(responseHelper.INVALID_TRANSACTION_ID);

    const transactionData = await transactionLib.findOne(
      req.body.transaction_id
    );

    if (!transactionData) return res.json(responseHelper.INVALID_TRANSACTION_ID);

    const bothPartiesData = await userLib.find([transactionData.senderId, transactionData.receiverId]);

    const isValueUpdated = await userLib.update({
      id: (bothPartiesData.filter(data => data.id == transactionData.receiverId))[0].id,
      balance: { $gte: transactionData.amount }
    }, {
      $set: { balance: (bothPartiesData.filter(data => data.id == transactionData.receiverId))[0].balance -  transactionData.amount }
    });

    if(isValueUpdated.modifiedCount == constant.ACTIVE) {
      await Promise.all([
        transactionLib.update(transactionData.transactionId),
        userLib.update({
          id: (bothPartiesData.filter(data => data.id == transactionData.senderId))[0].id,
        }, {
          $set: { balance: (bothPartiesData.filter(data => data.id == transactionData.senderId))[0].balance + transactionData.amount },
        }
        )
      ]);

      if(cache.has(transactionData.transactionId)) cache.del(transactionData.transactionId);

      io.to((bothPartiesData.filter(data => data.id == transactionData.senderId))[0].connectionId).emit(constant.MONEY_REFUNDED);

      return res.json({
        response_code: response.SUCCESS.response_code,
        response_message: response.SUCCESS.response_message,
        response_data: {
          transaction_id: transactionData.transactionId,
          sender_id: transactionData.senderId,
          receiver_id: transactionData.receiverId,
          refunded_amount: transactionData.amount
        },
      });
    }

    return res.json(responseHelper.UN_SUCCESSFUL_REFUND);
  } catch (e) {
    return res.json(responseHelper.SOMETHING_WENT_WRONG);
  }
});

// Starting server
server.listen(process.env.API_PORT, () =>
  console.log(`server started at port ${process.env.API_PORT}`)
);