import React from 'react'
import StyledSocialLinks from './SocialLinks.style'

const links = [
  {
    icon: 'facebook-f',
    link: 'https://www.facebook.com/workimpulso'
  },
  {
    icon: 'twitter',
    link: 'https://twitter.com/impulsonetwork'
  },
  {
    icon: 'linkedin-in',
    link: 'https://www.linkedin.com/company/impulsowork/'
  },
  {
    icon: 'instagram',
    link: 'https://www.instagram.com/impulso.network/'
  },
  {
    icon: 'github',
    link: 'https://github.com/impulsonetwork'
  },
  {
    icon: 'rocketchat',
    link: 'https://chat.impulso.network'
  }
]

const renderLinks = () =>
  links.map((item, index) => (
    <li key={index}>
      <a
        href={item.link}
        className={`fab fa-${item.icon}`}
        target="_blank"
        rel="noopener noreferrer"
      />
    </li>
  ))

const SocialLinks = () => <StyledSocialLinks>{renderLinks()}</StyledSocialLinks>

export default SocialLinks
