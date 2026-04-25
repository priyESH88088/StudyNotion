import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // ===============================
  // Load current video based on URL params
  // ===============================
  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return

      if (!courseId || !sectionId || !subSectionId) {
        navigate("/dashboard/enrolled-courses")
        return
      }

      const section = courseSectionData.find((data) => data._id === sectionId)
      const video = section?.subSection?.find((data) => data._id === subSectionId)

      setVideoData(video || null)
      setPreviewSource(courseEntireData?.thumbnail || "")
      setVideoEnded(false)
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // ===============================
  // FIX: Listen to native 'ended' event on the real <video> DOM element
  // video-react exposes it at playerRef.current.video.video
  // ===============================
  useEffect(() => {
    if (!videoData) return

    // Wait one tick for Player to mount and attach the DOM node
    const timeout = setTimeout(() => {
      const videoEl = playerRef.current?.video?.video
      if (!videoEl) return

      const handleEnded = () => setVideoEnded(true)
      videoEl.addEventListener("ended", handleEnded)

      // Cleanup listener when video changes or component unmounts
      return () => videoEl.removeEventListener("ended", handleEnded)
    }, 300)

    return () => clearTimeout(timeout)
  }, [videoData])

  // ===============================
  // Check if first video
  // ===============================
  const isFirstVideo = () => {
    const secIndex = courseSectionData.findIndex((data) => data._id === sectionId)
    const subIndex = courseSectionData?.[secIndex]?.subSection?.findIndex(
      (data) => data._id === subSectionId
    )
    return secIndex === 0 && subIndex === 0
  }

  // ===============================
  // Check if last video
  // ===============================
  const isLastVideo = () => {
    const secIndex = courseSectionData.findIndex((data) => data._id === sectionId)
    const subIndex = courseSectionData?.[secIndex]?.subSection?.findIndex(
      (data) => data._id === subSectionId
    )
    const isLastSection = secIndex === courseSectionData.length - 1
    const isLastSub =
      subIndex === courseSectionData?.[secIndex]?.subSection?.length - 1
    return isLastSection && isLastSub
  }

  // ===============================
  // Navigate to NEXT video
  // ===============================
  const goToNextVideo = () => {
    const secIndex = courseSectionData.findIndex((data) => data._id === sectionId)
    const subIndex = courseSectionData[secIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (subIndex < courseSectionData[secIndex].subSection.length - 1) {
      const nextId = courseSectionData[secIndex].subSection[subIndex + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextId}`)
      return
    }

    if (secIndex < courseSectionData.length - 1) {
      const nextSection = courseSectionData[secIndex + 1]
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  // ===============================
  // Navigate to PREVIOUS video
  // ===============================
  const goToPrevVideo = () => {
    const secIndex = courseSectionData.findIndex((data) => data._id === sectionId)
    const subIndex = courseSectionData[secIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (subIndex > 0) {
      const prevId = courseSectionData[secIndex].subSection[subIndex - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevId}`)
      return
    }

    if (secIndex > 0) {
      const prevSection = courseSectionData[secIndex - 1]
      const lastSub = prevSection.subSection[prevSection.subSection.length - 1]
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${lastSub._id}`
      )
    }
  }

  // ===============================
  // Mark lecture as completed
  // ===============================
  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">

      {!videoData ? (
        <img
          src={previewSource}
          alt="thumbnail"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />

          {/* ================= END SCREEN ================= */}
          {videoEnded && (
            <div className="absolute inset-0 z-[100] grid place-content-center bg-black/70">

              {/* Mark as completed */}
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={loading ? "Loading..." : "Mark As Completed"}
                  customClasses="text-xl px-4 mx-auto"
                />
              )}

              {/* Rewatch — seek to 0, then play */}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef.current) {
                    playerRef.current.seek(0)
                    playerRef.current.play()
                  }
                  setVideoEnded(false)
                }}
                text="Rewatch"
                customClasses="text-xl px-4 mx-auto mt-2"
              />

              {/* Prev / Next */}
              <div className="mt-10 flex gap-x-4">
                {!isFirstVideo() && (
                  <button className="blackButton" onClick={goToPrevVideo}>
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button className="blackButton" onClick={goToNextVideo}>
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="text-3xl font-semibold">{videoData?.title}</h1>
      <p>{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails