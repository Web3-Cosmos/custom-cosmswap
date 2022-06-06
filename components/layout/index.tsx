import { ReactNode, useEffect } from "react"

export default function Layout(props: {
  children?: ReactNode
}) {

  return (
    <div className="w-screen h-screen bg-stack-1">
      {props.children}
    </div>
  )
}