import CreateFolders from "@/components/global/create-folders"
import CreateWorkspace from "@/components/global/create-workspace"
import Folders from "@/components/global/folders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type Props={
    params:{workspaceId:string}
}

export default function workSpacePage({params}:Props){
    return (
        <div>
            <Tabs defaultValue="videos" className="mt-6" >
                <div className="flex w-full justify-between items-center">
                   <TabsList className="bg-transparent gap-2 pl-0">
                    <TabsTrigger className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] " value="videos">
                        Videos
                    </TabsTrigger>
                    <TabsTrigger className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525] " value="archive">
                        Archive
                    </TabsTrigger>
                    </TabsList> 
                    <div className="flex gaap-x-3">
                            {/* Component to create a workspace */}
                            <CreateWorkspace/>
                            {/* Component to create a folder */}
                            <CreateFolders workspaceId={params.workspaceId}/>

                    </div>
                </div>
                {/* component to display the folders */}
                <section className="py-9">
                    <TabsContent value="videos">
                        <Folders workspaceId={params.workspaceId}/>
                    </TabsContent>
                </section>
            </Tabs>
        </div>
    )
}