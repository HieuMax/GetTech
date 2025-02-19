import React from "react";
import Button from "./Button";

const SubscribeSection = () => {
  return (
    <section
      id='contact-us'
      className='max-w-[1280px] mx-auto flex justify-between items-center max-lg:flex-col gap-10 t border-b border-[#475467] py-10 max-xl:px-5'
    >
        <div className="flex flex-col">
          <h3 className='text-3xl lg:max-w-md font-palanquin font-semibold text-white py-4'>
              Join our new sletters
          </h3>
          <p className="text-[#F2F4F7]">We’ll send you a nice letter once per week. No spam.</p>
        </div>
     
      <div className='lg:max-w-[40%] w-full flex items-center max-sm:flex-col gap-5 p-2.5 '>
        <input type='text' placeholder='Enter your email' className='`mt-4 w-full px-6 py-3 font-semibold rounded-lg shadow-md transition duration-300 hover:opacity-80' />
        <div className='flex max-sm:justify-end items-center max-sm:w-full'>
            <Button text="Subcribe" bgColor="bg-blue-600" textColor="text-white" />

        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;