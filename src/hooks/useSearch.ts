import { useEffect, useState } from "react";
import { useQueryData } from "./useQueryData";
import { searchUsers } from "@/actions/user";


type userType={
    id:string
    subscription:{
        plan:'PRO'|'FREE'
    } | null
    firstname:string | null 
    lastname:string | null 
    image:string | null 
    email:string | null 
}[] | undefined

// hook used to search workspace through the database using keys
// implementing debounce in the search query   
export function useSearch(key:string,type:'USERS'){
    // query: Stores the current value of the search input.
   const[query,setQuery]=useState<string>('');
   // debounce: Holds the debounced value of query. Updated only after the debounce delay (1 second).
   const[debounce,setDebounce]=useState<string>('');
   // onUsers: Stores the fetched search results.
   const[onUsers,setOnUsers]=useState<userType>(undefined)
 // used to update the search in the query state value as the user types the workspace
   function onSearchQuery(e:React.ChangeEvent<HTMLInputElement>){
        setQuery(e.target.value)
   }
   // implementing debouncing
   // after every 1 sec the value of debounce gets changed
   useEffect(()=>{
    const delayInputTimeoutId=setTimeout(()=>{
        setDebounce(query);
    },1000)
    return ()=>clearTimeout(delayInputTimeoutId)
   },[query]);
     // key , queryFn , enable
   const {refetch,isFetching}=useQueryData([key,debounce],async({queryKey})=>{
                                                                              if(type==='USERS'){
                                                                                  const users=await searchUsers(queryKey[1] as string);
                                                                                  if(users.status===200)setOnUsers(users.data)
                                                                              }
                                                                          });
    // when the value of debounce changes then this function runs again and refetch the data using useQueryData function
    useEffect(()=>{
        if(debounce)refetch();
        if(!debounce)setOnUsers(undefined)
        return ()=>{
           return
        }
    },[debounce])       
    return {onSearchQuery,query,isFetching,onUsers};                                                               
}