import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'

import useAuthStore from '@/store/authStore'
import { IUser } from '@/types'

const SuggestedAccounts = () => {
   const { fetchAllUsers, allUsers } = useAuthStore();

   useEffect(() => {
      fetchAllUsers()
   }, [fetchAllUsers])

   return (
      <div className='xl:border-b-2 border-gray-200 pb-4'>
         <p className='text-gray-500 mt-4 font-semibld hidden xl:block'>Suggested Accounts</p>
         <div>
            {allUsers.slice(0, 3).map((user: IUser) => (
               <Link href={`/profile/${user._id}`} key={user._id}>
                  <div className='flex gap-3 p-2 hover:bg-primary cursor-pointer font-semibold rounded'>
                     <div className='w-8 h-8'>
                        <Image
                           src={user.image}
                           width={34}
                           height={34}
                           className='rounded-full'
                           alt='user profile'
                           layout='responsive'
                        />
                     </div>
                     <div className='hidden xl:block'>
                        <p className='flex gap-1 items-center text-md font-bold text-primary lowercase'>
                           {user.userName}
                           <GoVerified className='text-blue-400' />
                        </p>
                        <p className='capitalize txt-gray-400 text-xs'>
                           {user.userName}
                        </p>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div >
   )
}

export default SuggestedAccounts