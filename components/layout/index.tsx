import { ReactNode, useEffect } from "react"

export default function Layout(props: {
  children?: ReactNode
}) {

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-stack-1">
      {props.children}
    </div>
  )
}