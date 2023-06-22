import { QuestionPricingSchema, CurrencyConversionSchema } from '../schema/index.js';


const QuestionPriceInUsd = async (questionType) => {

    var que_pricing = await QuestionPricingSchema.findOne({ Type: questionType });

    var conversionrate = await CurrencyConversionSchema.findOne();

    var price = que_pricing.question_price;

    var conv_rate = conversionrate.ConversionToInr;

    var que_pr = (price / conv_rate);

    que_pr = Number.parseFloat(que_pr).toFixed(2);

    return que_pr;

}

export { QuestionPriceInUsd };