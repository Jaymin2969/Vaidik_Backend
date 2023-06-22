import Joi from "joi";

const StudentCouponValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    couponCode: Joi.string().required().label("couponCode").error(new Error('Please enter correct couponCode!')),
    // validityDate: Joi.date().required().label("validityDate").error(new Error('Please enter validityDate!')),
    // discount: Joi.string().required().label("discount").error(new Error('Please enter correct discount!')),
}

const StudentCouponValidatorSchema = Joi.object(StudentCouponValidator);

export default StudentCouponValidatorSchema;