import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import { MdOutlineCancel } from 'react-icons/md'
import { BsFillPlayFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import axios from 'axios'
import { BASE_URL } from '@/utils'
import { IUser, Video } from '@/types'
import useAuthStore from '@/store/authStore'
import LikeButton from '@/components/LikeButton'
import Comments from '@/components/Comments'

interface IProps {
   postDetails: Video
}

const Detail = ({ postDetails }: IProps) => {
   const [post, setPost] = useState(postDetails);
   const [playing, setPlaying] = useState(false)
   const [isVideoMuted, setVideoIsMuted] = useState(false)
   const [comment, setComment] = useState('');
   const [isPostingComment, setIsPostingComment] = useState(false)
   const router = useRouter()
   const { userProfile }: any = useAuthStore()

   const videoRef = useRef<HTMLVideoElement>(null)

   useEffect(() => {
      if (post && videoRef?.current) {
         videoRef.current.muted = isVideoMuted;
      }
   }, [post, isVideoMuted])

   if (!post) return null

   const onVideoClick = () => {
      if (playing) {
         videoRef?.current?.pause();
         setPlaying(false)
      } else {
         videoRef?.current?.play();
         setPlaying(true)
      }
   }



   const handleLike = async (like: boolean) => {
      if (userProfile) {
         const res = await axios.put(`${BASE_URL}/api/like`, {
            userId: userProfile._id,
            postId: post._id,
            like
         });
         setPost({ ...post, likes: res.data.likes });
      }
   };

   const handleDislike = async (like: boolean) => {
      if (userProfile) {
         const res = await axios.put(`${BASE_URL}/api/dislike`, {
            userId: userProfile._id,
            postId: post._id,
            like
         });
         setPost({ ...post, likes: res.data.likes });
      }
   }

   const addComment = async (e: any) => {
      e.preventDefault()

      if (userProfile && comment) {
         setIsPostingComment(true)

         const { data } = await axios.put(`${BASE_URL}/api/post/${post?._id}`, {
            userId: userProfile?._id,
            comment
         })

         setPost({ ...post, comments: data.comments })
         console.log(data)
         setComment('');
         setIsPostingComment(false)
      }
   }

   return (
      <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
         <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center  bg-black' >
            <div className='absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
               <p className='cursor-pointer ' onClick={() => router.back()}>
                  <MdOutlineCancel className='text-white text-[35px]' />
               </p>
            </div>
            <div className='relative'>
               <div className='flex items-center lg:h-[100vh] h-[60vh]'>
                  <video
                     ref={videoRef}
                     src={post.video.asset.url}
                     className='h-[90vh] cursor-pointer'
                     loop
                     onClick={() => { }}
                  >
                  </video>
               </div>
               <div className='absolute top-[45%] left-[45%]'>
                  {!playing && (
                     <button onClick={onVideoClick}>
                        <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
                     </button>
                  )}
               </div>
            </div>

            <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
               {isVideoMuted ? (
                  <button
                     onClick={() => setVideoIsMuted(false)}
                  >
                     <HiVolumeOff className='text-white text-2xl lg:text-4xl' />
                  </button>
               ) : (
                  <button
                     onClick={() => setVideoIsMuted(true)}
                  >
                     <HiVolumeUp className='text-white text-2xl lg:text-4xl' />
                  </button>
               )}
            </div>
         </div>

         <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
            <div className='lg:mt-20 ml-10 mt-10'>
               <div className='flex items-start gap-3 p-2 cursor-pointer font-semibold rounded'>
                  <div className=''>
                     <Link href='/'>
                        <>
                           <Image
                              width={62}
                              height={62}
                              className='rounded-full md:w-20 md:h-20 h-16 w-6 '
                              src={post.postedBy.image}
                              alt='profile pics'
                              layout=' responsive'
                              objectFit='contain'
                           />
                        </>
                     </Link>
                  </div>
                  <div>
                     <Link href='/'>
                        <div className='mt-3 flex flex-col gap-2 '>
                           <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                              {post.postedBy.userName} {' '}
                              <GoVerified className='text-blue-400 text-md' />
                           </p>
                           <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{post.postedBy.userName}</p>
                        </div>
                     </Link>
                  </div>
               </div>

               <p className='px-10 text-lg text-gray-600'>
                  {post.caption}
               </p>
               <div className='mt-6 px-10'>
                  {userProfile && (
                     <LikeButton likes={post.likes} handleLike={() => handleLike(true)} handleDislike={() => handleDislike(false)} />
                  )}
               </div>
               <Comments
                  comment={comment}
                  setComment={setComment}
                  addComment={addComment}
                  comments={post.comments}
                  isPostingComment={isPostingComment}
               />
            </div>
         </div>
      </div>
   )
}

export default Detail


export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
   const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

   return {
      props: {
         postDetails: data[0]
      }
   }
}