 
 import {fetchStoriesMatters} from "../../../../services/Services"
import avatar from "../../../../../public/a.png";
import Image from "next/image";
export default async function StoriesThatMatters() {
  const res = await fetchStoriesMatters();
  const stories = res.darkTruths;
  console.log(stories,'stories');
  return (
    <>
         <div className="row mt-5">
          {stories.map((items, index) => (
            <div className="col-4" key={index}>
              <div className="card oval border-0 py-2 m-2">
                <div className="d-flex justify-content-between align-items-center" style={{zIndex:999}}>
                  <div>
                    <h1 className="header_font_one fw-semibold">{items.yourStoryTitle}</h1>
                  </div>
                  <div>
                    <Image src={avatar} alt="Profile Pic" height={50} width={50} style={{ borderRadius:'50%'}} />
                  </div>
                </div>
                <div></div>
              </div>
              <div className="card p-2 mt-3">
                 <p className="header_font_three">{items.chroniclesOfYou}</p>
              </div>
            </div> 
          ))}
        </div>
     </>
  );
}
