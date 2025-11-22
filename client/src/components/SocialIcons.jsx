import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FacebookLogo, 
  TwitterLogo, 
  LinkedinLogo, 
  GithubLogo, 
  GitBranch, 
  WhatsappLogo 
} from 'phosphor-react'

const SocialIcons = () => {
  return (
    <div className='flex items-center gap-3 mt-5 ml-1 mb-2 max-md:mt-4'>
      <Link 
        target='_blank' 
        to='https://x.com/Shiv_ang07'
        className="group transition transform hover:scale-110 text-[#cbc3c3] hover:text-gray-700"
      >
        <TwitterLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>
      <Link 
        target='_blank' 
        to='https://www.linkedin.com/in/shivang-upadhyay-70277a240/'
        className="group transition transform hover:scale-110 text-[#1e17ea] hover:text-blue-600"
      >
        <LinkedinLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>
      <Link 
        target='_blank' 
        to='https://github.com/shivangupadhyy'
        className="group transition transform hover:scale-110 text-[#c2baba] hover:text-gray-500"
      >
        <GithubLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>
      <Link 
        target='_blank' 
        to='https://github.com/shivangupadhyy/Edemy-LMS'
        className="group transition transform hover:scale-110 text-[#e01d1d] hover:text-red-600"
      >
        <GitBranch size={34} weight="fill" className="transition-colors duration-300" />
      </Link>
    </div>
  )
}

export default SocialIcons
