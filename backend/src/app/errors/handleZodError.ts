import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../types/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    // Take last path if exists, otherwise use "root"
    const lastPath =
      issue.path.length > 0 ? issue.path[issue.path.length - 1] : "root";

    // Ensure type is string | number
    const path: string | number =
      typeof lastPath === "string" || typeof lastPath === "number"
        ? lastPath
        : String(lastPath);

    return {
      path,
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
