"use client"

import { RootState } from "@/store"
import { useSelector } from "react-redux"

export default function Profile() {
    const auth = useSelector((state:RootState)=>state.auth.user)
    return (
        <div>Profile</div>
    )
}