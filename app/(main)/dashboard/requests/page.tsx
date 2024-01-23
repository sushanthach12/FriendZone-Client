import FriendRequests from "@/components/FriendRequests"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

const RequestsPage = async () => {
    const session = await getServerSession(authOptions)

    if (!session) notFound()
    //ids of people who sent current user loggedin user friend request

    const incomingSenderIds = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as string[]

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const res = await fetchRedis('get', `user:${senderId}`) as string
            const sender = JSON.parse(res) as User
            return {
                senderId,
                user: sender
            }
        })
    );

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Friend Requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests
                    incomingFriendRequests={incomingFriendRequests}
                    sessionId={session.user.id}
                />
            </div>
        </main>
    )
}

export default RequestsPage