import Joi from "joi";

const AdminStudentCouponValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    couponCode: Joi.string().required().label("couponCode").error(new Error('Please enter correct couponCode!')),
    validityDate: Joi.date().required().label("validityDate").error(new Error('Please enter validityDate!')),
    discount: Joi.number().required().label("discount").error(new Error('Please enter correct discount!')),
    id: Joi.any(),
}

const AdminStudentCouponValidatorSchema = Joi.object(AdminStudentCouponValidator);

export default AdminStudentCouponValidatorSchema;