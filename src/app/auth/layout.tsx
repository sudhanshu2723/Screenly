import React from "react"

type Props={
    children:React.ReactNode
}


export default function ({children}:Props){
    return (
        <div  className="container h-screen flex justify-center items-center">
          {children}
        </div>
    )
}