import * as Joi from 'joi';

const validateSchema = (schema: Joi.ObjectSchema<any>, body: any) => {
  if (!body) {
    throw new Error('MISSING_BODY');
  }
  const { error } = schema.validate(body);
  if (error) {
    console.log('given body', body);
    console.log(error.details[0].message);
    return false;
  }
  return true;
};

export default validateSchema;
