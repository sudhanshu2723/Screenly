import { UseMutateFunction } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z, { ZodSchema } from 'zod'


//The useZodForm hook simplifies form management by integrating react-hook-form for state handling
//  and zod for schema-based validation. It validates form inputs against the provided Zod schema and
//  handles submissions using a mutation function (e.g., for API calls).
//  The hook returns utilities for input registration, watching fields, error handling, and form resetting.

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const onFormSubmit = handleSubmit(async (values) => mutation({ ...values }))

  return { register, watch, reset, onFormSubmit, errors }
}
export default useZodForm
