import {  QueryFunction, QueryKey, useQuery } from "@tanstack/react-query"

// function which takes query key and quryFn as input and returns the data and other loading values
// enable: Determines if the query runs automatically
export function useQueryData(queryKey:QueryKey,queryFn:QueryFunction){
    const {data,isPending,refetch,isFetched,isFetching}=useQuery({
        queryKey,
        queryFn,
    })
 

    return {data,isPending,isFetched,refetch,isFetching}
}