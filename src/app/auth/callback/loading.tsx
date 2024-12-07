import { Spinner } from "@/components/global/loader/spinner"



export default function AuthLoading(){
    return (
        <div className="flex h-screen w-full justify-center items-center ">
                <Spinner/>
        </div>
    )
}