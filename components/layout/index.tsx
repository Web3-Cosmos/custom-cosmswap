import { ReactNode, useEffect } from 'react'

export default function Layout(props: {
  children?: ReactNode
}) {

  useEffect(() => {
    document?.documentElement.classList.remove('dark', 'light')
    document?.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="w-full h-screen bg-stack-1">
      {props.children}
    </div>
  )
}