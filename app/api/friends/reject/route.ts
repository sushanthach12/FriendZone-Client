import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export const POST = async (req: Request, res: Response) => {
    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        // validate the id is string or valid data
        const { id: idToReject } = z.object({ id: z.string() }).parse(body)

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToReject)

        return new Response('OK')

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid Request payload', { status: 422 })
        }

        return new Response('Invalid Request', { status: 400 })
    }
}