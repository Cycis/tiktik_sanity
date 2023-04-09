import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
// import icons
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { client } from '@/utils/client'
import { SanityAssetDocument } from '@sanity/client'

import { topics } from '@/utils/constants'
import useAuthStore from '@/store/authStore'
import { IUser } from '@/types'
import { BASE_URL } from '@/utils'


const Upload = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [videoAsset, setVideoAsset] = useState<SanityAssetDocument>();
   const [wrongFileType, setWrongFileType] = useState(false)
   const [caption, setCaption] = useState('')
   const [category, setCategory] = useState('');
   const [topic, setTopic] = useState<String>(topics[0].name);
   const [savingPost, setSavingPost] = useState(false);

   const router = useRouter()

   const [user, setUser] = useState<IUser | null>();
   const { userProfile } = useAuthStore();

   useEffect(() => {
      setUser(userProfile)
   }, [])

   const uploadVideo = async (e: any) => {
      const selectedFile = e.target.files[0];
      const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

      console.log(selectedFile.type, selectedFile.name)
      if (fileTypes.includes(selectedFile.type)) {
         client.assets.upload('file', selectedFile, {
            contentType: selectedFile.type,
            filename: selectedFile.name
         })
            .then((data) => {
               setVideoAsset(data)
               setIsLoading(false)
            })
      } else {
         setIsLoading(false)
         setWrongFileType(true)
      }
   }

   const handlePost = async () => {
      if (caption && videoAsset?._id && topic) {
         setSavingPost(true)

         const document = {
            _type: 'post',
            caption,
            video: {
               _type: 'file',
               asset: {
                  _type: 'reference',
                  _ref: videoAsset?._id,
               },
            },
            userId: user?._id,
            postedBy: {
               _type: 'postedBy',
               _ref: user?._id,
            },
            topic,
         };

         await axios.post(`${BASE_URL}/api/post`, document);

         router.push('/')
      }
   }

   const handleDiscard = () => {
      setSavingPost(false);
      setVideoAsset(undefined);
      setCaption('');
      setTopic('');
   };

   return (
      <div className='flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-16 bg-[#f8f8f8] justify-center'>
         <div className='bg-white rounded-lg xl:h-[88vh] w-[80%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6'>
            <div>
               <div>
                  <p className='text-2xl font-bold'>Upload Video</p>
                  <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
               </div>
               <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[400px] p-10 hover:border-red-300 hover:bg-gray-300 cursor-pointer'>
                  {isLoading ? (
                     <p>Uploading...</p>
                  ) : (
                     <div>
                        {videoAsset ? (
                           <div>
                              <video
                                 src={videoAsset?.url}
                                 loop
                                 controls
                                 className='rounded-xl h-[390px] mt-10 bg-black'
                              >
                              </video>
                           </div>
                        ) : (
                           <label className='cursor-pointer' >
                              <div className='flex flex-col items-center justify-center h-full'>
                                 <div className='flex flex-col items-center justify-center'>
                                    <p className='font-bold text-xl'>
                                       <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                    </p>
                                    <p className='text-xl font-semibold'>Upload Video
                                    </p>
                                 </div>
                                 <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                    MP4 or WebM or ogg <br /> 720x1280 or higher <br />
                                    Up to 10 minutes <br />
                                    Less than 2GB
                                 </p>
                                 <p className='bg-[#f51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>Select File</p>
                              </div>
                              <input type='file' id='file' name='upload-video' onChange={uploadVideo} className='w-0 h-0' />
                           </label>
                        )}
                     </div>
                  )}
                  {wrongFileType && (
                     <p className='text-center text-xl text-red-400 font-semibold mt-10 w-[250px]'>Please select a video file</p>
                  )}
               </div>

            </div>

            <div className='flex flex-col gap-3 pb-10'>
               <label className='text-md font-medium'>Caption</label>
               <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className='rounded outline-none text-md border-2 border-gray-200 p-2'
               />
               <label className='text-md font-medium'>Choose a Category</label>
               <select
                  onChange={(e) => setTopic(e.target.value)}
                  className='outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 text-gray-700 hover:bg-slate-300 rounded cursor-pointer'
               >
                  {topics.map((topic) => (
                     <option
                        key={topic.name}
                        className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                        value={topic.name}
                     >
                        {topic.name}
                     </option>
                  ))}
               </select>
               <div className='flex gap-6 mt-10'>
                  <button
                     className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                     onClick={handleDiscard}
                     type='button'
                  >
                     Discard
                  </button>
                  <button
                     className='bg-[#f51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                     onClick={handlePost}
                     type='button'
                  >
                     Post
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Upload