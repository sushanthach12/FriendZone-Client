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

        // add or make both the users as friends
        await db.sadd(`user:${session.user.id}:friends`, idToAdd)  // add the incoming user to current user friend
         
        await db.sadd(`user:${idToAdd}:friends`, session.user.id)  // add the current user friend to incoming user

        // delete the incoming friends request
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)


        return new Response('OK')
    } catch (error) {
        if(error instanceof z.ZodError) {
            return new Response('Invalid Request payload', { status: 422})
        }

        return new Response('Invalid Request', { status: 400 })
    }
}