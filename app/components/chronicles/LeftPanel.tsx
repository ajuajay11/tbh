// import Image from 'next/image';
// import { cookies } from 'next/headers';
export default async function LeftPanel() {
  // const cookieStore = await cookies();
  // const avatar = cookieStore.get('avatar')?.value;
  return (
    <>
      <section className="relative w-1/5 pt-20 p-4 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/boy.png')` }} />
        <div className="relative z-10">
          {/* <img src={avatar} alt="Boy" width={100} height={50} /> */}
          {/* <ul className="space-y-2">
            <li className="hover:text-pink-400 cursor-pointer"> Home</li>
            <li className="hover:text-pink-400 cursor-pointer"> Posts</li>
            <li className="hover:text-pink-400 cursor-pointer"> Stats</li>
            <li className="hover:text-pink-400 cursor-pointer"> Settings</li>
          </ul> */}
        </div>
      </section>


    </>
  )
}

