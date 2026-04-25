import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"

// Swiper Components
import { Swiper, SwiperSlide } from "swiper/react"

// Swiper Styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "../../App.css"

// Swiper Modules
import { Autoplay, Pagination } from "swiper"

// Icons
import { FaStar, FaQuoteLeft } from "react-icons/fa"

// API utilities
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const truncateWords = 18

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)

        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success) {
          setReviews(data?.data || [])
        }
      } catch (error) {
        console.log("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Safe truncate function
  const truncateReview = (text = "") => {
    if (!text) return "No review available."

    const words = text.split(" ")

    return words.length > truncateWords
      ? `${words.slice(0, truncateWords).join(" ")}...`
      : text
  }

  // Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-richblack-5">
        Loading reviews...
      </div>
    )
  }

  // Empty UI
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-richblack-300">
        No reviews available
      </div>
    )
  }

  return (
    <div className="w-full bg-richblack-900 p-2">
      {/* Section Heading */}
      <div className="mx-auto mb-12 w-11/12 max-w-maxContent text-center">

        <p className=" text-richblack-300">
          Real feedback from learners who trusted our platform
        </p>
      </div>

      {/* Slider */}
      <div className="mx-auto w-11/12 max-w-maxContent">
        <Swiper
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
          }}
          loop={reviews.length >= 4}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review?._id}>
              <div
                className="group flex min-h-[320px] flex-col justify-between rounded-xl mt-2 border border-richblack-700 bg-richblack-800 p-6
                transition-all duration-300 hover:-translate-y-1 hover:border-yellow-100 hover:shadow-xl"
              >
                {/* Top */}
                <div>
                  {/* User Info */}
                  <div className="mb-5 flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/7.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt="user"
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-richblack-600"
                    />

                    <div>
                      <h3 className="font-semibold text-richblack-5">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </h3>

                      <p className="max-w-[180px] truncate text-xs text-richblack-400">
                        {review?.course?.courseName}
                      </p>
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <div className="mb-4 text-yellow-100 opacity-80">
                    <FaQuoteLeft size={20} />
                  </div>

                  {/* Review */}
                  <p className="leading-7 text-richblack-100">
                    {truncateReview(review?.review)}
                  </p>
                </div>

                {/* Bottom Rating */}
                <div className="mt-6 flex items-center gap-3 border-t border-richblack-700 pt-4">
                  <p className="font-semibold text-yellow-100">
                    {Number(review?.rating || 0).toFixed(1)}
                  </p>

                  <ReactStars
                    count={5}
                    value={Number(review?.rating || 0)}
                    size={16}
                    edit={false}
                    activeColor="#ffd700"
                    color="#4b5563"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider