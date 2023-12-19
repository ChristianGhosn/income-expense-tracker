const validateForm = (data, schema) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (!error) {
    return console.log("Form valid");
  } else {
    const errorData = {};

    for (let item of error.details) {
      const name = item.path[0];
      const message = item.message;
      errorData[name] = message;
    }
    return errorData;
  }
};

export default validateForm;
