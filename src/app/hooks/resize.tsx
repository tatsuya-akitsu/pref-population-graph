import { useLayoutEffect, useRef, useState } from "react"

const useWindowSize = () => {
  const [width, setWidth] = useState<number>(0)
  const isDevFlg = useRef<boolean>(true)

  useLayoutEffect(() => {
    if (process.env.NODE_ENV === 'development' && isDevFlg.current) {
      isDevFlg.current = false;
      return;
    }

    const updateWindowSize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  return width
}

export default useWindowSize
