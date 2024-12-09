"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

type Props={
    children:React.ReactNode
}

const client=new QueryClient();
// we have to wrap the App around QueryClientProvider to use react query
export default function ReactQueryProvider({children}:Props){
    return (
       <QueryClientProvider client={client}>
            {children}
       </QueryClientProvider>
    )
}