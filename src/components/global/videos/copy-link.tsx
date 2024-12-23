import { Button } from "@/components/ui/button"

import { Link } from "lucide-react"
import { toast } from "sonner"



type Props={
    videoId:string 
    className?:string 
    variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

export default function CopyLink({videoId,className,variant}:Props){
    // function which copies message on the clipboard and after that displays a toast message
    function onCopyClipboard(){
       navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}}`)
       return toast('Copied',{
        description:"Link successfully copied" 
       }) 
    }
    return (
        <Button variant={variant} onClick={onCopyClipboard} className={className}>
            <Link size={20} className="text-[#a4a4a4]"/>
        </Button>
    )
}