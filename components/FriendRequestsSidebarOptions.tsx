"use client"

import { User } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    sessionId: string
    initialUnseenRequestCount: number
}

const FriendRequestsSidebarOptions = ({ initialUnseenRequestCount, sessionId }: Props) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

    return <Link
        href='/dashboard/requests'
        className=' text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <div className='text-gray-400 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium '>
            <User className='h-4 w-4' />
        </div>
        <p className='truncate'>Friend requests</p>

        {unseenRequestCount > 0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
                {unseenRequestCount}
            </div>
        ) : null}
    </Link>
}

export default FriendRequestsSidebarOptions