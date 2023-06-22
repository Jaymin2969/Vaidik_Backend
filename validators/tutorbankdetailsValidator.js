import Joi from 'joi';

const bankdetailsValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    country: Joi.string().required().label("Country").error(new Error('Please enter correct Country!')),
    name: Joi.string().required().label("Name").error(new Error('Please enter correct Name!')),
    bankName: Joi.string().required().label("Bank_name").error(new Error('Please enter Valid Bank Name!')),
    accountNumber: Joi.string().required().label("AC_number").error(new Error('Please enter Valid Account Number!')),
    IFSCCode: Joi.string().required().label("IFSC_number").error(new Error('Please enter Valid IFSC Number!')),
    accountType: Joi.string().required().label("AC_type").error(new Error('Please enter Valid Account Type!')),
    panCard: Joi.string().required().label("Pancard").error(new Error('Please enter Valid Pancard!'))
}

const TutorBankDetailsValidatorSchema = Joi.object(bankdetailsValidator);

export default TutorBankDetailsValidatorSchema;
            