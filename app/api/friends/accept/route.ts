import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json()

        // validate the id is string or valid data
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        // verify both users are not already friends
        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd)

        if (isAlreadyFriends) {
            return new Response('Already Friends', { status: 400 })
        }

        // if there is a incoming friend of the user for the current user
        const hasFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd)

        if (!hasFriendRequest) {
            return new Response('No friend Request', { status: 400 })
        }

        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis('get', `user:${session.user.id}`),
            fetchRedis('get', `user:${idToAdd}`),
        ])) as [string, string]

        const user = JSON.parse(userRaw) as User
        const friend = JSON.parse(friendRaw) as User

        // add or make both the users as friends

        await Promise.all([
            db.sadd(`user:${user.id}:friends`, friend.id),  // add the incoming user to current user friend
            db.sadd(`user:${friend.id}:friends`, user.id),  // add the current user friend to incoming user
            db.srem(`user:${user.id}:incoming_friend_requests`, friend.id) // delete the incoming friends request
        ])

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid Request payload', { status: 422 })
        }

        return new Response('Invalid Request', { status: 400 })
    }
}