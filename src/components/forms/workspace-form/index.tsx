import FormGenerator from "@/components/global/form-generator";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace"
import Loader from '@/components/global/loader'


// creating a form of the PRO user to create workspaces
export default function WorkspaceForm(){
    const {errors,isPending,onFormSubmit,register}=useCreateWorkspace();
    return (
       <form
       onSubmit={onFormSubmit}
       className="flex flex-col gap-y-3"
       >
       <FormGenerator 
       name="name"
       register={register}
       placeholder={'Workspace Name'}
       label="Name"
       errors={errors}
       inputType="input"
       type="text"
        />
        <Button className="text-sm w-full mt-2" type="submit" disabled={isPending}> 
            <Loader state={isPending}>Create Worksapce</Loader>
        </Button>
       </form>
    )
}