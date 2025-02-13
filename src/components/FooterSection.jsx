import { copyrightSign } from "../assets/icons";
import { footerLinks, socialMedia } from "../constants";

const FooterSection = () => {
  return (
    <footer className='max-w-[1280px] mx-auto mt-16 '>
      <div className='flex justify-between items-start gap-20 flex-wrap max-lg:flex-col'>
        <div className='flex flex-col items-start'>
          <a href='/' className="flex text-white font-bold items-center gap-2">
            <img
              src="/logo.png"
              alt='logo'
              width={150}
              height={46}
              className='m-0 size-8 '
            />
            <p className="tracking-wider text-xl leading-relaxed">GetTech</p>
          </a>
          <p className='mt-6 text-base leading-7 font-montserrat sm:max-w-sm text-white'>
            Get shoes ready for the new term at your nearest Nike store. Find
            Your perfect Size In Store. Get Rewards
          </p>
          
        </div>

        <div className='flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap'>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className='font-montserrat text-base leading-normal font-medium mb-6 text-[#98A2B3]'>
                {section.title}
              </h4>
              <ul>
                {section.links.map((link) => (
                  <li
                    className='mt-3 text-white font-montserrat text-base leading-normal text-white-400 hover:text-slate-gray'
                    key={link.name}
                  >
                    <a href={link.link}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between text-white-400 mt-16 max-sm:flex-col max-sm:items-center border-t border-[#475467]'>
        <div className='flex flex-1 justify-start items-center gap-2 font-montserrat cursor-pointer py-10'>
          <img
            src={copyrightSign}
            alt="{copyrightSign}"
            width={20}
            height={20}
            className='rounded-full m-0'
          />
          <p className="text-[#98A2B3]">2022 GetTech. All rights reserved.</p>
        </div>
        <div className='flex items-center gap-5'>
            {socialMedia.map((icon) => (
              <div
                className='flex justify-center items-center w-10 h-10 bg-white rounded-full text-red-500'
                key={icon.alt}
              >
                <img src={icon.src} alt={icon.alt} width={24} height={24} className="text-red-400"/>
              </div>
            ))}
          </div>
      </div>
    </footer>
  );
};

export default FooterSection;