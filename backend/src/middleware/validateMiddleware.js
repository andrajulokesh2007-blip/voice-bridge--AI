export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: errorDetails[0]?.message || 'Validation error',
      errors: errorDetails,
    });
  }
  req.body = result.data;
  next();
};
