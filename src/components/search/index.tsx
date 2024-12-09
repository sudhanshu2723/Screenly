import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch"


type Props={
    workspaceId:string
}

export default function Search({workspaceId}:Props){
// The useSearch function is a custom React hook that performs a debounced search for user data.
// It updates the query as the user types, waits 1 second (debounce) before triggering an API call
// to fetch users via useQueryData, and manages the search results (onUsers) and loading state (isFetching).
        const {query,onSearchQuery,isFetching,onUsers}=useSearch('go-workspace','USERS');
// hook used to invite members
    const {}=useMutationData(['invite-member'],(data:{recieverId:string;email:string}))
    return (
        <div>

        </div>
    )
}