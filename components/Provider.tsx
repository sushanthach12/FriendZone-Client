"use client"

import { Toaster } from "react-hot-toast"

type Props = {
    children: React.ReactNode
}

const Provider = (props: Props) => {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {props.children}
        </>
    )
}

export default Provider