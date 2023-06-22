import Joi from 'joi';

const AdminStudentReferralValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    referralpersonalreward: Joi.number().required().label("Referralpersonalreward").error(new Error('Please enter correct Referralpersonalreward!')),
    referralotherreward: Joi.number().required().label("Referralotherreward").error(new Error('Please enter correct Referralotherreward!')),
    paymentcondition: Joi.number().required().label("Paymentcondition").error(new Error('Please enter correct paymentcondition!')),

}

const AdminStudentReferralValidatorSchema = Joi.object(AdminStudentReferralValidator);

export default AdminStudentReferralValidatorSchema;
            