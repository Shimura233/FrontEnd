import React, { useState, useEffect } from 'react'
import CTPlayer from './CTPlayer'

export function CTPlayerRow({media}) {
  const [orderClassName, setOrderClassName] = useState('')
  const [primary, setPrimary] = useState(true)

  useEffect(() => {
    const name = primary ? '' : 'switch-player'
    setOrderClassName(() => name)
  }, [primary])

  const [play, setPlay] = useState(false)
  const [currTime, setCurrTime] = useState(-1)
  const [playbackRate, setPlaybackRate] = useState(-1)
  const [trackSrc, setTrackSrc] = useState('')

  const handleFunctions = {
    switchToPrimary: () => setPrimary(() => true),
    switchToSecondary: () => setPrimary(() => false),
    syncPlay: () => {
      setPlay(() => true)
    },
    syncPause: () => {
      setPlay(() => false)
    },
    setCurrTime: currTime => setCurrTime(() => currTime),
    setPlaybackRate: rate => setPlaybackRate(() => rate),
    setTrackSrc: src => {
      console.log('change src to', src)
      setTrackSrc(() => src)
    }
  }

  return (
    <div className={`player-container ${orderClassName}`}>
      <div className="primary-col">
        <CTPlayer 
          {...handleFunctions}
          media={media} 
          primary={primary}  
          play={play} currTime={currTime} playbackRate={playbackRate}
          trackSrc={trackSrc}
          video1
        />
      </div>

      <div className="secondary-col">
        <CTPlayer 
          {...handleFunctions}
          media={media}
          primary={!primary}  
          trackSrc={trackSrc}
          play={play} currTime={currTime} playbackRate={playbackRate}
        />
      </div>
    </div>
  )
}