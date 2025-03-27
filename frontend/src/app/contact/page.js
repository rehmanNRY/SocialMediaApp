import AuthRedirect from '@/components/AuthRedirect';
import { FiExternalLink } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const socialMedia = [
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/rehman-nry',
      icon: <FaLinkedin className="text-[#0A66C2] text-3xl" />,
      description: 'Lets connect professionally.',
      username: 'rehman-nry',
      color: 'from-[#0A66C2]/10 to-[#0A66C2]/30',
      hoverColor: 'hover:border-[#0A66C2]',
      iconBg: 'bg-[#0A66C2]/10',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/rehmanNRY',
      icon: <FaGithub className="text-[#181717] text-3xl" />,
      description: 'Check out my code and repositories.',
      username: 'rehmanNRY',
      color: 'from-[#181717]/10 to-[#181717]/30',
      hoverColor: 'hover:border-[#181717]',
      iconBg: 'bg-[#181717]/10',
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com/rehman_nry/',
      icon: <FaInstagram className="text-[#C13584] text-3xl" />,
      description: 'Get a glimpse of my visual life.',
      username: 'rehman_nry',
      color: 'from-[#C13584]/10 to-[#C13584]/30',
      hoverColor: 'hover:border-[#C13584]',
      iconBg: 'bg-[#C13584]/10',
    },
    {
      name: 'WhatsApp',
      link: 'https://wa.link/fcyw8d',
      icon: <FaWhatsapp className="text-[#25D366] text-3xl" />,
      description: "Let's talk about programming!",
      username: '923014340329',
      color: 'from-[#25D366]/10 to-[#25D366]/30',
      hoverColor: 'hover:border-[#25D366]',
      iconBg: 'bg-[#25D366]/10',
    },
  ];

  return (
    <AuthRedirect>
      <main className="bg-gradient-to-br from-[#f8faff] to-[#f0f4ff] text-gray-900 flex items-center justify-center px-4"
        style={{ minHeight: "calc(100vh - 4.5rem)" }}
      >
        <div 
          className="w-full max-w-6xl mx-auto text-center py-16 md:py-20"
        >
          <div className="mb-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Let's Connect
            </h1>
            <div 
              className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"
            />
          </div>
          
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {socialMedia.map((media) => (
              <a
                key={media.name}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-6 bg-gradient-to-br ${media.color} backdrop-blur-sm rounded-2xl border-2 border-white/50 ${media.hoverColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative`}
              >
                <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-white/10 z-0" />
                
                <div className="flex flex-col items-center relative z-10">
                  <div className={`p-4 rounded-full ${media.iconBg} mb-4`}>
                    {media.icon}
                  </div>
                  <h2 className="text-2xl font-bold group-hover:text-blue-700 transition-all">
                    {media.name}
                  </h2>
                  <p className="mt-3 text-gray-600 group-hover:text-gray-900 transition-all">
                    {media.description}
                  </p>
                  <p 
                    className="mt-3 text-sm font-medium text-gray-500 group-hover:text-gray-800 bg-white/50 px-3 py-1 rounded-full"
                  >
                    {media.name === 'WhatsApp' ? '+' : '@'}{media.username}
                  </p>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-16">
            <button 
              className="relative"
            >
              <a 
                target='_blank' 
                href="https://rehman-nry.netlify.app/" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center"
              >
                Visit Portfolio
                <span className='ml-2'>
                  <FiExternalLink />
                </span>
              </a>
            </button>
          </div>
        </div>
      </main>
    </AuthRedirect>
  );
}