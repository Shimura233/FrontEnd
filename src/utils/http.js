import axios from 'axios'
import { util, user } from './index'
import { deviceType, osVersion, osName, fullBrowserVersion, browserName } from 'react-device-detect'
const monthMap = require('./json/monthNames.json')

/**
 * Set up http
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || window.location.origin,
  timeout: 100000,
})


/**
 * api 
 * - Object for http requests from backend
 */
export const api = {
  initialData: require('./json/initialData.json'),
  offeringAccessType: require('./json/offeringAccessTypes.json'),
  playlistTypes: require('./json/playlistTypes.json'),

  /**
   * Function called when all the requests executed
   * then hide the loading page
   */
  baseUrl: () => process.env.REACT_APP_API_BASE_URL || window.location.origin,
  getMediaFullPath: function(path) { // need to change later
    return `${this.baseUrl()}${path}`
  },
  contentLoaded: function (interval) {
    const ele = document.getElementById('ct-loading-wrapper')
    if(ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        if (ele.parentNode) ele.outerHTML = ''
        // ele.classList.add('hide')
      }, interval || 500)
    }
  },

  /**
   * Functions for set or get the auth/b2c token
   */
  authToken: () => localStorage.getItem('authToken'),
  getAuthToken: function(auth0Token) {
    return http.post(this.baseUrl() + '/api/Account/SignIn', { auth0Token })
  },
  saveAuthToken: function (authToken) {
    localStorage.setItem('authToken', authToken)
  },
  userId: () => localStorage.getItem('userId'),
  withAuth: function (configs) {
    return {
      ...configs,
      headers: {
        Authorization: 'Bearer ' + this.authToken()
      }
    }
  },
  

  /********************* Functions for http requests *********************/

  /**
   * GET
   */
  getFile: function(path) {
    return http.get(path)
  },
  getData: function (path, id, params) {
    path = `/api/${path}`
    if(id) path = `${path}/${id}`
    return http.get(path, this.withAuth({ params }))
  },
  // User Metadata
  getUserMetaData: function() {
    return this.getData('Account/GetUserMetadata/GetUserMetadata')
  },
  // Universities
  getUniversities: function() {
    return this.getData('Universities')
  },
  getUniversityById: function (universityId) {
    return this.getData('Universities', universityId)
  },
  // Terms
  getTermById: function(termId) {
    return this.getData('Terms', termId)
  },
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
  },
  // Departments
  getDepartments: function() {
    return this.getData('Departments')
  },
  getDepartById: function(departId) {
    return this.getData('Departments', departId)
  },
  getDepartsByUniId: function (id) {
    return this.getData('Departments/ByUniversity', id)
  },
  // Courses
  getCourseById: function (courseId) {
    return this.getData('Courses', courseId)
  },
  getCoursesByDepartId: function (id) {
    return this.getData('Courses/ByDepartment', id) 
  },
  getCoursesByInstId: function (id) {
    return this.getData('Courses/ByInstructor', id) 
  },
  // Roles
  getRolesByUniId: function (universityId) {
    return this.getData('Roles', null, {universityId})
  },
  // Offerings
  getOfferingsByStudent: function() {
    return this.getData('Offerings/ByStudent')
  },
  getOfferingById: function(id) {
    return this.getData('Offerings', id)
  },
  getCourseOfferingsByInstructorId: function (id) {
    return this.getData('CourseOfferings/ByInstructor', id)
  },
  // Playlists
  getPlaylistById: function(playlistId) {
    return this.getData('Playlists', playlistId)
  },
  getPlaylistsByOfferingId: function(offeringId) {
    return this.getData('Playlists/ByOffering', offeringId)
  },
  // media
  getMediaById: function(mediaId) {
    return this.getData('Media', mediaId)
  },
  getCaptionsByTranscriptionId: function(transId) {
    return this.getData('Captions/ByTranscription', transId)
  },
  searchCaptionInOffering: function(offeringId, query) {
    return this.getData('Captions/SearchInOffering', null, { offeringId, query })
  },
  // Admin
  adminGetLogs: function(from, to) {
    return this.getData('Admin/GetLogs', null, { from, to })
  },
  // Logs
  getCourseLogs: function(eventType, offeringId, start, end) {
    return this.getData('Logs/CourseLogs', null, { offeringId, eventType, start, end })
  },
  getStudentLogs: function(eventType, mailId, start, end) {
    return this.getData('Logs/StudentLogs', null, { mailId, eventType, start, end })
  },

  /**
   * POST
   */
  postData: function (path, data, params, otherConfigs) {
    path = `/api/${path}`
    return http.post(path, data, this.withAuth({ params, ...otherConfigs }))
  },
  // User Metadata
  postUserMetaData: function(metadata) {
    return this.postData('Account/PostUserMetadata/PostUserMetadata', {metadata})
  },
  // Universities
  createUniversity: function(data) {
    return this.postData('Universities', data)
  },
  // Terms
  createTerm: function(data) {
    return this.postData('Terms', data)
  },
  // Departments
  createDepartment: function(data) {
    return this.postData('Departments', data)
  },
  // Roles
  createRole: function (mailId) {
    return this.postData('Roles', undefined, { mailId })
  },
  // Courses
  createCourse: function(data) {
    return this.postData('Courses', data)
  },
  // Offerings
  createOffering: function(data) {
    return this.postData('Offerings', data)
  },
  createCourseOffering: function (data) {
    return this.postData('CourseOfferings', data)
  },
  addCourseStaffToOffering: function (offeringId, data) {
    return this.postData(`Offerings/AddUsers/${offeringId}/Instructor`, data)
  },
  // Playlists
  createPlaylist: function(data) {
    return this.postData('Playlists', data)
  },
  // Medias
  uploadVideo: function (playlistId, video1, video2, onUploadProgress) {
    const formData = new FormData()
    formData.append('video1', video1)
    formData.append('video2', video2)
    formData.append('playlistId', playlistId)
    console.log('uploadData', {playlistId, video1, video2})
    return this.postData('Media', formData, null, { onUploadProgress })
  },
  // Captions
  updateCaptionLine: function(data) {
    return this.postData('Captions', { id: data.id, text: data.text })
  },
  captionUpVote: function(id) { // captionId
    return this.postData('Captions/UpVote', null, { id })
  },
  captionCancelUpVote: function(id) { // captionId
    return this.postData('Captions/CancelUpVote', null, { id })
  },
  captionDownVote: function(id) { // captionId
    return this.postData('Captions/DownVote', null, { id })
  },
  captionCancelDownVote: function(id) { // captionId
    return this.postData('Captions/CancelDownVote', null, { id })
  },

  /**
   * PUT
   */
  updateData: function (path, data, id) {
    path = `/api/${path}`
    if (!id) id = data.id
    return http.put(`${path}/${id}`, data, this.withAuth())
  },
  updateUniversity: function(data) {
    return this.updateData('Universities', data)
  },
  updateTerm: function(data) {
    return this.updateData('Terms', data)
  },
  updateDepartment: function(data) {
    return this.updateData('Departments', data)
  },
  updateCourse: function(data) {
    return this.updateData('Courses', data)
  },
  updateOffering: function(data) {
    return this.updateData('Offerings', data)
  },
  updatePlaylist: function(data) {
    return this.updateData('Playlists', data)
  },
  renameMedia: function(mediaId, filename) {
    return this.updateData('Media/PutJsonMetaData', { filename }, mediaId)
  },

  /**
   * DELETE
   */
  deleteData: function (path, id, params) {
    path = id ? `/api/${path}/${id}` : `/api/${path}` 
    return http.delete(path, this.withAuth({ params }))
  },
  deleteUniversity: function(universityId) {
    return this.deleteData('Universities', universityId)
  },
  deleteTerm: function(termId) {
    return this.deleteData('Terms', termId)
  },
  deleteDepartment: function(departId) {
    return this.deleteData('Departments', departId)
  },
  deleteRole: function(mailId) {
    return this.deleteData('Roles', null, { mailId })
  },
  deleteCourse: function(courseId) {
    return this.deleteData('Courses', courseId)
  },
  deleteOffering: function(offeringId) {
    return this.deleteData('Offerings', offeringId)
  },
  deleteCourseOffering: function (courseId, offeringId) {
    return this.deleteData(`CourseOfferings/${courseId}/${offeringId}`)
  },
  deleteCourseStaffFromOffering: function(offeringId, userId) {
    return this.deleteData(`UserOfferings/${offeringId}/${userId}`)
  },
  deletePlaylist: function(playlistId) {
    return this.deleteData('Playlists', playlistId)
  },
  deleteMedia: function(mediaId) {
    return this.deleteData('Media', mediaId)
  },

  /**
   * 
   * @param {} eventType 
   * timeupdate, play, pause, seeking, seeked, changedspeed, fullscreenchange, 
   * filtertrans, edittrans, sharelink
   * selectcourse, userinactive, changevideo
   * @param {*} data 
   * { offeringId, mediaId, json }
   */
  sendUserAction: function(eventType, data = {}) {
    // console.log({eventType, ...data, userId: this.userId() })
    const { json, mediaId, offeringId } = data
    return this.postData('Logs', {
      eventType, 
      mediaId, 
      offeringId,
      userId: this.userId(),
      json: {
        ...json, 
        device: { deviceType, osVersion, osName, fullBrowserVersion, browserName }
      }
    })
  },


  completeSingleOffering: function(courseOffering, setOffering, index, currOfferings) {
    // set id for future use
    courseOffering.id = courseOffering.offering.id
    // get department acronym
    courseOffering.courses.forEach( course => {
      if (!user.isAdmin() && course.id === "test_course") courseOffering.isTestCourse = true
      this.getDepartById(course.departmentId) 
        .then( ({data}) => {
          course.acronym = data.acronym
          if (index !== undefined) {
            currOfferings[index] = courseOffering
            setOffering(currOfferings)
          } else {
            setOffering(courseOffering)
          }
        })
    })
    // get term name
    this.getTermById(courseOffering.offering.termId)
      .then(({data}) => {
        courseOffering.offering.termName = data.name
        if (index !== undefined) {
          currOfferings[index] = courseOffering
          setOffering(currOfferings)
        } else {
          setOffering(courseOffering)
        }
      })
  },
  completeOfferings: function(rawOfferings, currOfferings, setOffering) {
    // rawOfferings = handleData.shuffle(rawOfferings)
    rawOfferings.forEach( (offering, index) => {
      this.getData('Offerings', offering.id)
        .then( ({data}) => {
          this.completeSingleOffering(data, setOffering, index, currOfferings)
        })
    })
  },
  getFullNumber: function(courses, separator) {
    var name = ''
    courses.forEach( course => {
      name += (course.acronym || '') + course.courseNumber + (separator || '/')
    })
    name = name.slice(0, name.length - 1)
    return name
  },
  parseMedia: function(media) {
    let re = { 
      id: '', 
      mediaName: '', 
      createdAt: '', 
      isTwoScreen: false, 
      videos: [], 
      transcriptions: [] 
    }
    if (!media) return re
    const { id, playlistId, jsonMetadata, sourceType, videos, transcriptions } = media
    if (!id || !jsonMetadata || !videos) return re
    re.id = id
    // re.videos = videos
    re.createdAt = jsonMetadata.createdAt
    re.playlistId = playlistId
    re.isTwoScreen = videos.length && (videos[0].video2 || videos[0].video2Path)
    if (sourceType === 1) { // youtube
      re.mediaName = jsonMetadata.title
    } else if (sourceType === 0) { // echo360
      let { lessonName, createdAt } = jsonMetadata
      let date = new Date(createdAt)
      re.mediaName = `${lessonName}  ${monthMap[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    } else { // upload
      if (jsonMetadata.filename) re.mediaName = jsonMetadata.filename
      else {
        let fileData = JSON.parse(jsonMetadata.video1)
        re.mediaName = fileData.FileName
      }
    }

    videos.forEach( video => {
      re.videos.push({
        srcPath1: `${this.baseUrl()}${video.video1Path || video.video1.path}`,
        srcPath2: re.isTwoScreen ? `${this.baseUrl()}${video.video2Path || video.video2.path}` : null
      })
    })

    transcriptions.forEach( trans => {
      re.transcriptions.push({
        id: trans.id,
        language: trans.language,
        src: `${this.baseUrl()}${trans.path || trans.file.path}`
      })
    })
    return re
  },
  getValidURLFullNumber: function(fullNumber) {
    return fullNumber.replace(/\//g, '-')
  },
  parseURLFullNumber: function(fullNumber) {
    fullNumber = fullNumber || util.parseSearchQuery().courseNumber
    return fullNumber.replace(/-/g, '/')
  },
}