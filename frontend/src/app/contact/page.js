import AuthRedirect from '@/components/AuthRedirect';

export default function ContactPage() {
  const socialMedia = [
    { 
      name: 'LinkedIn', 
      link: 'https://www.linkedin.com/in/rehman-nry', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', 
      description: 'Let’s connect professionally.', 
      username: 'rehman-nry',
    },
    { 
      name: 'GitHub', 
      link: 'https://github.com/rehmanNRY', 
      icon: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', 
      description: 'Check out my code and repositories.', 
      username: 'rehmanNRY',
    },
    { 
      name: 'Instagram', 
      link: 'https://www.instagram.com/rehman_nry/',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png', 
      description: 'Get a glimpse of my visual life.', 
      username: 'rehman_nry',
    },
    { 
      name: 'WhatsApp', 
      link: 'https://wa.link/fcyw8d', 
      icon: 'https://static.vecteezy.com/system/resources/thumbnails/016/716/480/small/whatsapp-icon-free-png.png', 
      description: "Let's talk about programming!", 
      username: '+923014340329', 
    },
  ];

  return (
    <AuthRedirect>
    <main className="bg-[#F5F6FA] text-gray-900 flex items-center justify-center px-6"
    style={{ minHeight: "calc(100vh - 4.5rem)" }}
    >
      <div className="w-full max-w-6xl mx-auto text-center py-20">
        <h1 className="text-2xl md:text-4xl font-bold mb-12 text-gray-800">
          Let's Connect✨
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {socialMedia.map((media) => (
            <a
              key={media.name}
              href={media.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-blue-100">
                  {/* Replace below with relevant SVG icons or images */}
                  <img
                    src={`${media.icon}`}
                    alt={media.name}
                    className="w-12 h-12"
                  />
                </div>
                <h2 className="mt-4 text-2xl font-semibold group-hover:text-blue-600 transition-all">
                  {media.name}
                </h2>
                <p className="mt-2 text-gray-600 group-hover:text-gray-900 transition-all">
                  {media.description}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  @{media.username}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12">
          <a target='_blank' href="https://rehman-nry.netlify.app/" className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 hover:shadow-xl transition-all duration-300">
            Visit Portfolio
          </a>
        </div>
      </div>
    </main>
    </AuthRedirect>
  );
}