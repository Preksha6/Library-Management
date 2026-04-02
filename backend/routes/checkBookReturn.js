const express = require('express')
const BookTransactionSchema = require('../models/bookTransaction')
const CheckBookReturnRouter = express.Router()

const runBookReturnCheck = async (req, res) => {
  await checkBookReturn()
  res.status(200).json({ success: true, message: `Book Fine Charges Checked` })
}

CheckBookReturnRouter.route('/').get(runBookReturnCheck)

// This API is to be called everytime ADMIN / CLIENT logs in
// Update Extra charge (PRICE) of entire booktransaction if returnDate is passed and isReturned is still False
const checkBookReturn = async () => {
  try {
    const overdueTransactions = await BookTransactionSchema.find({
      returnDate: { $lt: new Date() },
      isReturned: false,
    });

    const currDate = new Date();

    for (const transaction of overdueTransactions) {
      const returnDateObj = new Date(transaction.returnDate);

      const diff = currDate - returnDateObj;

      const numberOfDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      const finePerDay = 10;

      const calculatedFine = numberOfDays * finePerDay;

      // Update fine every time (not only if 0)
      transaction.extraCharge = calculatedFine;

      await transaction.save();
    }

  } catch (error) {
    console.error('Error updating book Fine CHARGE : ', error);
  }
};

module.exports = CheckBookReturnRouter
