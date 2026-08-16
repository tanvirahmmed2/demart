'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import RichTextEditor from '@/component/helper/RichTextEditor'
import { 
  BiStar, 
  BiLoaderAlt, 
  BiCommentDetail, 
  BiTime, 
  BiCheckCircle,
  BiPlusCircle,
  BiArrowBack,
  BiTrash,
  BiInfoCircle
} from 'react-icons/bi'

export default function UserReviewsPage() {
  const { user, loading: userLoading, userSidebar } = useContext(Context)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Form states
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete your review? This will remove it from public view.')) {
      return
    }
    setDeletingId(id)
    try {
      await axios.delete(`/api/review/${id}`)
      toast.success('Review deleted successfully!')
      setReviews([])
      fetchMyReviews(true)
    } catch (err) {
      toast.error('Failed to delete review')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const fetchMyReviews = async (silent = false) => {
    if (!silent) setReviewsLoading(true)
    try {
      const res = await axios.get('/api/review?personal=true')
      setReviews(res.data)
    } catch (err) {
      toast.error('Failed to load your reviews')
      console.error(err)
    } finally {
      if (!silent) setReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyReviews()
    }
  }, [user])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars')
      return
    }

    setSubmitting(true)
    try {
      const cleanComment = comment && comment !== '<p></p>' ? comment.trim() : '';
      await axios.post('/api/review', {
        rating,
        title: title.trim(),
        comment: cleanComment
      })
      toast.success('Review submitted! It will appear publicly once approved by moderation.')
      setTitle('')
      setComment('')
      setRating(5)
      fetchMyReviews(true)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStarsSelector = () => {
    return (
      <div className="flex gap-1.5 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-xl transition cursor-pointer hover:scale-110"
          >
            <BiStar className={star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
          </button>
        ))}
        <span className="text-xs text-slate-600 font-bold ml-1.5 uppercase tracking-wider">{rating} / 5 Stars</span>
      </div>
    )
  }

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5 text-amber-500 text-xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <BiStar key={star} className={star <= count ? 'fill-amber-500' : 'text-slate-200'} />
        ))}
      </div>
    )
  }

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F1F5F9]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center">
          <BiCommentDetail className="text-5xl text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Reviews Panel</h1>
          <p className="text-slate-600 text-xs leading-relaxed">Please log in to write testimonials and review your submitted feedback.</p>
          <div className="mt-2">
            <Link href="/login" className="px-6 py-2.5 bg-[#73976A] text-white rounded-xl text-xs font-bold hover:bg-[#607E59] transition cursor-pointer shadow-xs">
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiCommentDetail className="text-[#73976A] text-2xl" />
              Your Reviews & Feedback
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Submit product reviews, share testimonials, and check moderation states.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 bg-white shadow-2xs">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Dashboard Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Submit Review Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-6">
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-3 text-center py-6">
                <BiInfoCircle className="text-3xl text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Review Limit Reached</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  You have already submitted a review. To maintain authenticity, we limit feedback to one submission per account.
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  To write a new review, delete your existing review using the trash action button in your feedback log.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <BiPlusCircle className="text-[#73976A]" /> Write a Testimonial
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">Let us know how your experience with our store and catalog products was!</p>
                </div>

                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Rating Score</label>
                    {renderStarsSelector()}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Subject Title <span className="text-[#BD4444]">*</span></label>
                    <input className="input-style focus:border-[#73976A]"
                      required
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Detailed Review Comment</label>
                    <RichTextEditor value={comment} onChange={setComment} />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <BiLoaderAlt className="animate-spin text-sm" /> Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right panel: Listing customer's reviews */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Your Feedback Log</h2>

            {reviewsLoading ? (
              <div className="flex items-center justify-center text-slate-400 text-xs gap-1.5 py-12">
                <BiLoaderAlt className="animate-spin text-base" /> Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-2 py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <BiCommentDetail className="text-3xl text-slate-350" />
                <p className="text-xs font-bold text-slate-700">No reviews posted yet</p>
                <p className="text-xs text-slate-400 max-w-xs">You have not submitted any product feedback or store testimonials yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((rev) => {
                  return (
                    <div 
                      key={rev.review_id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-2 hover:border-slate-300 transition"
                    >
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div>
                          <h3 className="text-xs font-bold text-slate-800">{rev.title}</h3>
                          <div className="mt-1">{renderStars(rev.rating)}</div>
                        </div>

                        <div>
                          {rev.is_approved ? (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center gap-1">
                              <BiCheckCircle /> Approved
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <BiTime /> Pending Approval
                            </span>
                          )}
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="text-slate-700 text-xs leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200 mt-1">
                          "{rev.comment.replace(/<[^>]*>/g, '').trim()}"
                        </p>
                      )}

                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                          <span>ID: #{rev.review_id}</span>
                          <span>•</span>
                          <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.review_id)}
                          disabled={deletingId === rev.review_id}
                          className="text-[#BD4444] hover:text-[#842f2f] p-1 rounded transition cursor-pointer flex items-center gap-1 font-sans text-xs font-bold"
                        >
                          {deletingId === rev.review_id ? (
                            <BiLoaderAlt className="animate-spin" />
                          ) : (
                            <>
                              <BiTrash className="text-xs" /> Delete Review
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

