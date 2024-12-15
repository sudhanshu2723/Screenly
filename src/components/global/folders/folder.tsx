'use client' 

import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import Loader from "../loader" // Displays a loading state.
import FolderDuotone from "@/components/icons/folder-duotone"
import { useRef, useState } from "react"
import { useMutationData } from "@/hooks/useMutationData"
import { renameFolders } from "@/actions/workspace" 
import { Input } from "@/components/ui/input"

type Props = {
    name: string // Folder name.
    id: string // Unique identifier for the folder.
    optimistic?: Boolean // Whether to show a faded "optimistic" UI state.
    count?: number // Number of items in the folder.
}

export default function Folder({ name, id, optimistic, count }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the input field.
    const folderCardRef = useRef<HTMLDivElement | null>(null); // Ref for the folder container.
    
    const pathName = usePathname(); // Get the current path.
    const router = useRouter(); // For navigation.
    const [onRename, setOnRename] = useState(false); // Tracks whether the folder is in "rename" mode.

    // Redirects the user to the folder's route when clicked.
    const handleFolderClick = () => {
        router.push(`${pathName}/folder/${id}`);
    };

    // Toggles "rename" mode on and off.
    const Rename = () => setOnRename(true); // Enable rename mode.
    const Renamed = () => setOnRename(false); // Disable rename mode.

    // Handles renaming the folder by sending the updated name to the backend.
    const { mutate, isPending } = useMutationData(
        ['rename-folders'], // Mutation key.
        (data: { name: string }) => renameFolders(id, name), // API call to rename folder.
        'workspace-folders', // Cache identifier for the folder workspace.
        Renamed // Callback after successful mutation to exit rename mode.
    );

    // Enables rename mode when the folder name is double-clicked.
    const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation(); // Prevents navigation on double-click.
        Rename(); // Enable rename mode.
    };

    // Handles updating the folder name when the input loses focus.
    const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
        if (inputRef.current && folderCardRef.current) {
            // Checks if the blur event originated outside the input or folder container.
            if (
                !inputRef.current.contains(e.target as Node | null) &&
                !folderCardRef.current.contains(e.target as Node | null)
            ) {
                if (inputRef.current.value) {
                    mutate({ name: inputRef.current.value }); // Update the folder name via mutation.
                } else {
                    Renamed(); // Exit rename mode if no value is provided.
                }
            }
        }
    };

    return (
        <div
            onClick={handleFolderClick} // Navigates to folder route on click.
            ref={folderCardRef} // Ref for DOM manipulation.
            className={cn(
                optimistic && 'opacity-60', // Adds opacity if optimistic is true.
                'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]'
            )}
        >
            <Loader state={false}> {/* Loader wraps the folder content */}
                <div className="flex flex-col gap-[1px]">
                    {onRename ? ( // Conditional rendering for renaming.
                        <Input
                            onBlur={(e) => updateFolderName(e)} // Handles renaming logic on blur.
                            placeholder={name} // Shows the current name as a placeholder.
                            autoFocus // Focuses on the input field automatically.
                            className="border-none text-base w-full outline-none text-neutral-300 bg-transparent p-0"
                            ref={inputRef} // Ref for the input field.
                        />
                    ) : (
                        <p
                            className="text-neutral-300"
                            onClick={(e) => e.stopPropagation()} // Prevents click event propagation.
                            onDoubleClick={handleNameDoubleClick} // Enables renaming on double-click.
                        >
                            {name} {/* Displays the folder name */}
                        </p>
                    )}
                    <span className="text-sm text-neutral-500">{count || 0} Videos</span> {/* Video count */}
                </div>
            </Loader>
            <FolderDuotone /> {/* Folder icon */}
        </div>
    );
}
