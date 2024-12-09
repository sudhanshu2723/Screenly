import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


type Props={
    trigger:React.ReactNode
    children:React.ReactNode
    title:string 
    description:string 
    className?:string 
}
// used to invite other users to workspace 
export default function Modal({children,description,title,trigger,className}:Props){
    return (
       <Dialog>
           <DialogTrigger className={className} asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent> 
       </Dialog>
    )
}