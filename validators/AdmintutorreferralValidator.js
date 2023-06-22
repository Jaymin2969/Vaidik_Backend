import Joi from 'joi';

const AdminTutorReferralValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    referralpersonalreward: Joi.number().required().label("Referralpersonalreward").error(new Error('Please enter correct Referralpersonalreward!')),
    referralotherreward: Joi.number().required().label("Referralotherreward").error(new Error('Please enter correct Referralotherreward!'))
}

const AdminTutorReferralValidatorSchema = Joi.object(AdminTutorReferralValidator);

export default AdminTutorReferralValidatorSchema;
            