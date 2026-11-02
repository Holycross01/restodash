"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login')
  }, [router])


  return (
    <div>
      <h1>welcome to nextjs restodash</h1>
    </div>
  )

}
export default Home;