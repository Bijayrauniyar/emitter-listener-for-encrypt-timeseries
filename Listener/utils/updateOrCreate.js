const Message = require("../models/Message");

const updateOrCreate = async (formatedDateTime, parseDecryptData) => {

    const findData = await Message.findOne({ timeStamp: formatedDateTime });

    if (!findData) {
        try {
            return await Message.create({ timeStamp: formatedDateTime, data: parseDecryptData });
        } catch (error) {
            console.log(error, 'while creating Message data ')
        }
    } else {
        try {
            return await Message.findByIdAndUpdate(findData._id, { timeStamp: formatedDateTime, data: [...findData.data, parseDecryptData] });
        } catch (error) {
            console.log(error, 'while creating Message data ')
        }
    }
}
module.exports = updateOrCreate;

