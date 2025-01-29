import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"


type Props={
    state:boolean
    className?:string
    color?:string
    children:React.ReactNode
}

 const Loader=({state,className,children}:Props)=>{
    if(state) 
        return <div className={cn(className)}>
                <Spinner />
                </div>
    else  
        return <div>{children}</div>
}

export default Loader