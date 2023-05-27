const userLib = require("../db/library/user.lib");
const constant = require("../global/constant");

const validateHeler = {};

validateHeler.inputValidator = (senderId, receiverId, amount, details) => {
    if(!senderId || senderId.trim() == "" || !receiverId || receiverId.trim() == "" || !details || details.trim() == "" || amount <= 0 ) return false;
    return true;
}

validateHeler.validateBothParties = async (senderId, receiverId) => {
    try {
        const bothPartiesData = await userLib.find([senderId, receiverId]);
        if(bothPartiesData.length == constant.ZERO) return { reason: "Both sender_id & receiver_id are invalid"};
        if(bothPartiesData.length == constant.ACTIVE) {
            const isReceiverDataPresent = (bothPartiesData.filter(data => data.id == receiverId))[0];
            if(!isReceiverDataPresent) return { status: false, reason: "receiver_id invalid"};
            const isSenderDataPresent = (bothPartiesData.filter(data => data.id == senderId))[0];
            if(!isSenderDataPresent) return { status: false, reason: "sender_id invalid"};
            if(isReceiverDataPresent.id == isSenderDataPresent.id) return { status: false, reason: "both ids are same"};
        }  else {
            return { status: true, reason: "", user_data: {
                sender_data: (bothPartiesData.filter(data => data.id == senderId))[0],
                receiver_data: (bothPartiesData.filter(data => data.id == receiverId))[0]
            }};
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = validateHeler;