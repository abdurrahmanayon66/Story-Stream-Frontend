'use client'
import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

type LottiePlayerProps = {
  animationData: object 
  loop?: boolean
  autoplay?: boolean
  className?: string
}

export default function LottiePlayer({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
      })

      return () => anim.destroy()
    }
  }, [animationData, loop, autoplay])

  return <div ref={containerRef} className={className} />
}
