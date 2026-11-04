import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import { type SubmitTarget, useNavigation, useSubmit } from "react-router";
import type { z } from "zod";

/**
 * Validates against a schema built per validation, so its messages follow the
 * selected language. Form inputs start empty (`null`) where the schema's output
 * does not allow it, which zodResolver's types cannot express.
 */
export function localizedResolver<Input extends FieldValues, Output>(
  schema: () => z.ZodType<Output>
): Resolver<Input, unknown, Output> {
  return (values, context, options) =>
    (
      zodResolver(schema() as never) as unknown as Resolver<
        Input,
        unknown,
        Output
      >
    )(values, context, options);
}

/** Submits a form's values to the current route's action as JSON. */
export function useJsonSubmit() {
  const submit = useSubmit();
  const navigation = useNavigation();
  return {
    // Plain link navigation also leaves the idle state; only a submission
    // carries a form method.
    submitting: navigation.formMethod != null,
    submitJson: (body: object) =>
      submit(body as SubmitTarget, {
        method: "post",
        encType: "application/json",
      }),
  };
}
