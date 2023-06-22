import { SubscriptionSchema, CurrencyConversionSchema } from '../schema/index.js';


const SubscriptionPriceInUsd = async (duration) => {

    var sub_pricing = await SubscriptionSchema.findOne({ duration: duration });

    var conversionrate = await CurrencyConversionSchema.findOne();

    var price = sub_pricing.price;

    var conv_rate = conversionrate.ConversionToInr;

    var sub_pr = (price / conv_rate);

    sub_pr = Number.parseFloat(sub_pr).toFixed(2);

    return sub_pr;

}

export { SubscriptionPriceInUsd };