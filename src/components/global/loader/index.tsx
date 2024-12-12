import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"


type Props={
    state:Boolean
    className?:string
    color?:string
    children:React.ReactNode
}

export const Loader=({state,className,children,color}:Props)=>{
    if(state) 
        return <div className={cn(className)}>
                <Spinner />
                </div>
    else  
        return <div>{children}</div>
}