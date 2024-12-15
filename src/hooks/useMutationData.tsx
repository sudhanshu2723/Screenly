import { MutationFunction, MutationKey, useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// wrppaer around useMutation hook
//  mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, TanStack Query exports a useMutation hook.
export function useMutationData(mutationKey:MutationKey,mutationFn:MutationFunction<any,any>,queryKey?:string,onSuccess?:()=>void){
    const client=useQueryClient();
    const{mutate ,isPending}=useMutation({
        mutationKey,
        mutationFn,
        onSuccess(data){
            // if the user provides the onSuccess then that function will be fired
            if(onSuccess)onSuccess()
                return toast(data?.status===200 ? 'Success':'Error',{
            description:data?.data
                })
        },
        onSettled:async()=>{
            return await client.invalidateQueries({queryKey:[queryKey]})
        }
    })
    return {mutate,isPending}

}

// The useMutationDataState function is a custom hook
//  that helps track and retrieve the latest variables 
// and status from a mutation in React
export function useMutationDataState(mutationKey:MutationKey){
    const data=useMutationState({
        filters:{mutationKey},
        select:(mutation)=>{
            return {
                variables:mutation.state.variables as any ,
                status:mutation.state.status
            }
        }
    });
    const latestVariables=data[data.length-1];
    return {latestVariables}
}