/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
// UI
import { Icon } from 'semantic-ui-react'
import Playlists from './Playlists'
// Vars
import { Button } from 'pico-ui'
import { useCTContext } from '../../../../components'
import { api, util, handleData, user } from '../../../../utils'
import './index.css'

export function OfferingDetail({ 
  state, 
  starOffering, 
  unstarOffering 
}) {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams()

  const { starredOfferingsJSON, watchHistoryJSON } = state
  const [offering, setOffering] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  // variables to present
  const [fullNumber, setFullNumber] = useState('Loading...')
  // const [courseNumber, setCourseNumber] = useState('Loading...')
  const [termName, setTermName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [description, setDescription] = useState('')
  const [courseName, setCourseName] = useState('Loading...')
  const [accessType, setAccessType] = useState(0)

  const [isStarred, setIsStarred] = useState(Boolean(starredOfferingsJSON[id]))
  useEffect(() => {
    setIsStarred(Boolean(starredOfferingsJSON[id]))
  }, [starredOfferingsJSON])

  const handleStar = () => {
    if (isStarred) unstarOffering(id)
    else starOffering(id)
    setIsStarred(isStarred => !isStarred)
  }

  const { generalError } = useCTContext()

  const getOffering = async () => {
    const propsState = history.location.state
    if (propsState && propsState.offering) {
      const { offering } = propsState
      setFullNumber(offering.fullNumber)
      setTermName(offering.termName)
      setDescription(offering.description)
      setSectionName(offering.sectionName)
      setCourseName(offering.courseName)
      setAccessType(offering.accessType)
      util.links.title(offering.fullNumber+' • '+offering.termName+' • '+offering.sectionName)
    } else {
      try {
        let { data } = await api.getOfferingById(id)
        api.completeSingleOffering(data, data => setOffering(data))
      } catch (error) {
        if (api.isAuthError(error)) {
          setPlaylists(['need-signin'])
          return 401
        } else {
          generalError({ header: "Couldn't load the offering." })
          return 500
        }
      }
    }

    return 200
  }

  const getPlaylists = async () => {
    try {
      let { data } = await api.getPlaylistsByOfferingId(id) 
      setPlaylists(data)
    } catch (error) {
      if (api.isAuthError(error)) {
        setPlaylists(['need-signin'])
      } else {
        setPlaylists([])
        generalError({ header: "Couldn't load the playlists." })
      }
    }
  }

  const setupOfferingDetails = async () => {
    let status = await getOffering()
    if (status === 200) {
      await getPlaylists()
      await api.sendUserAction('selectcourse', { offeringId: id })
    }
  }

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    util.scrollToTop('.sp-content')
    setupOfferingDetails()
    
  }, [id, history])


  /**
   * Set up variables after offerings loaded
   */
  useEffect(() => {
    if (!offering) return;
    if (offering.courses) {
      const number = api.getFullNumber(offering.courses)
      if (handleData.isValidCourseNumber(number)) {
        setFullNumber(number)
      }
    }
    if (offering.offering && offering.offering.termName) {
      setTermName(offering.offering.termName)
      setSectionName(offering.offering.sectionName)
      setCourseName(offering.offering.courseName)
      setDescription(offering.offering.description)
      setAccessType(offering.offering.accessType)
    }
    util.links.title(fullNumber+' '+termName+' '+sectionName)
  }, [offering])
  
  /**
   * Determine which page to go back
   */
  var pathname = util.links.home()
  if (history.location.state) {
    const { from } = history.location.state
    if (from === 'search') {
      pathname = util.links.search()
    } else if (from === 'history') {
      pathname = util.links.history()
    }
  }

  return (
    <div className="offering-detail ct-a-fade-in" >
      {/* Offering Info */}
      <div className="offering-info">
        <div className="goback-container">
          <Link 
            className="del-icon" 
            to={{
              pathname: pathname, 
              state: { value: location.state ? location.state.searchedValue : '' },
            }}
          >
            <Icon name="chevron left" /> Go Back
          </Link>
        </div>
        
        <h1 className="od-course-number">{fullNumber}</h1>

        <h2 className="od-course-name">
          {courseName}
          <span>{termName} | {sectionName}</span>
        </h2>
        {description && <><p className="offering-description">{description}</p></>}
        {
          user.isLoggedIn()
          &&
          <Button uppercase
            id="off-star-btn"
            color={isStarred ? "" : "teal"}
            icon={isStarred ? 'star' : 'star_border'}
            text={isStarred ? 'unstar' : 'star'}
            onClick={handleStar}
          />
        }
      </div>
      
      {/* Playlists */}
      <Playlists 
        offeringId={id}
        accessType={accessType}
        history={history} 
        playlists={playlists} 
        fullNumber={fullNumber}  
        watchHistoryJSON={watchHistoryJSON}
      />
    </div>
  )
}