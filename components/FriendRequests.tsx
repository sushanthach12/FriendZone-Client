"use client"

import axios from "axios"
import { Check, UserPlus, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests = ({ incomingFriendRequests, sessionId }: Props) => {
    const router = useRouter()

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId })

        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))  // remove the friend from the requests after accept

        router.refresh()
    }

    const rejectFriend = async (senderId: string) => {
        await axios.post('/api/friends/reject', { id: senderId })

        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))  // remove the friend from the requests after reject

        router.refresh()
    }

    return (
        <>
            {
                friendRequests.length === 0 ? (
                    <p className="text-sm text-zinc-500">Nothing to show here...</p>
                ) : (
                    friendRequests.map((request) => (
                        <div key={request.senderId} className='mt-auto flex items-center'>
                            <div className='flex flex-1 items-center justify-between gap-x-4 px-3 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className="flex items-center gap-x-3">
                                    <div className='relative h-8 w-8 bg-gray-50'>
                                        <Image
                                            fill
                                            referrerPolicy='no-referrer'
                                            className='rounded-full'
                                            src={request.user?.image || ""}
                                            alt='Your profile picture'
                                        />
                                    </div>

                                    <div className='flex flex-col'>
                                        <span aria-hidden={true}>{request.user?.name}</span>
                                        <span className='text-xs text-zinc-400' aria-hidden={true}>{request.user?.email}</span>
                                    </div>

                                </div>

                                <div className="flex gap-x-4 items-center justify-center">
                                    <button aria-label="accept friend" className="w-6 h-6 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md" onClick={() => acceptFriend(request.senderId)}>
                                        <Check className="font-semibold text-white w-3/4 h-3/4" />
                                    </button>

                                    <button aria-label="reject friend" className="w-6 h-6 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md" onClick={() => rejectFriend(request.senderId)}>
                                        <X className="font-semibold text-white w-3/4 h-3/4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )
            }
        </>
    )
}

export default FriendRequests