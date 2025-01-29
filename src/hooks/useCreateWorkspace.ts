
import { useMutationData } from "./useMutationData"
import { CreateWorkspace } from "@/actions/workspace"
import useZodForm from "./useZodForm";
import { workspaceSchema } from "@/components/forms/workspace-form/schema";


   // hook used to create new workspace for the pro users
export  const useCreateWorkspace=()=>{
    const {mutate,isPending}=useMutationData(['create-workspace'],(data:{name:string})=>CreateWorkspace(data.name),'user-workspace');
    const {errors,onFormSubmit,register}=useZodForm(workspaceSchema,mutate)
     return {errors,onFormSubmit,register,isPending}

}