import Joi from 'joi';

const AdminSetCurrencyConversionValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    Currency: Joi.string().trim().required().label("Currency").error(new Error('Please enter proper Currency!')),
    ConversionToInr: Joi.number().label("ConversionToInr").error(new Error('Please enter correct ConversionToInr!'))
}

const AdminSetCurrencyConversionValidatorSchema = Joi.object(AdminSetCurrencyConversionValidator);

export default AdminSetCurrencyConversionValidatorSchema;
