import { TabsContent } from "@/components/ui/tabs"

type Props={
    transcript:string 
}


export default function VideoTranscript({transcript}:Props){
    return (
        <TabsContent value="Transcript" className="p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-6">
                this is transcript
        </TabsContent>
    )
}