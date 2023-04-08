import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'

import VideoCard from '@/components/VideoCard'
import NoResults from '@/components/NoResults'
import { IUser, Video } from '../../types'
import useAuthStore from '../../store/authStore'
import { BASE_URL } from '@/utils'
import { useRouter } from 'next/router'

const Search = ({ videos }: { videos: Video[] }) => {
   const [isAccount, setIsAccount] = useState(false);
   const router = useRouter();
   const { searchTerm }: any = router.query;
   const { allUsers } = useAuthStore()

   const accounts = isAccount ? 'border-b-4 border-black' : 'text-gray-400'
   const isVideos = !isAccount ? 'border-b-4 border-black' : 'text-gray-400'

   const searchAccount = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()));


   return (
      <div className='w-full'>
         <div className='flex gap-10 my-10 border-b-2 border-gray-200 bg-white w-full'>
            <p className={`text-xl font-semibold cursor-pointer ${accounts}`} onClick={() => setIsAccount(true)}>Account</p>
            <p className={`text-xl font-semibold cursor-pointer ${isVideos}`} onClick={() => setIsAccount(false)}>Videos</p>
         </div>
         {isAccount ? (
            <div className='md:mt-16'>
               {searchAccount.length > 0 ? (
                  searchAccount.map((user: IUser, idx: number) => (
                     <Link href={`/profile/${user._id}`} key={idx}>
                        <div className='flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3'>
                           <div>
                              <Image
                                 src={user.image}
                                 width={50}
                                 height={50}
                                 className='rounded-full'
                                 alt='user profile'
                                 layout='responsive'
                              />
                           </div>
                           <div className='xl:block'>
                              <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                                 {user.userName.replaceAll(' ', '')}
                                 <GoVerified className='text-blue-400' />
                              </p>
                              <p className='capitalize text-gray-400 text-xs'>
                                 {user.userName}
                              </p>
                           </div>
                        </div>
                     </Link>
                  ))
               ) : (
                  <NoResults text={`No Account results for ${searchTerm}`} />
               )}
            </div>
         ) : (
            <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
               {videos?.length ? (
                  videos.map((post: Video, idx: number) => (
                     <VideoCard post={post} key={idx} />
                  ))
               ) : <NoResults text={`No video results for ${searchTerm}`} />}
            </div>
         )}
      </div>
   )
}

export const getServerSideProps = async ({ params: { searchTerm } }: { params: { searchTerm: string } }) => {

   const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

   return {
      props: { videos: res.data }
   }
}


export default Search

