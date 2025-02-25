 export default function StoriesThatMatters() {
    const stories =[{
        id:1,
        name:"ajay",
        description:"story 1",
        image:"image1.jpg",
        likes:100,
        comments:50,
        views:200 
    },
    {
        id:2,
        name:"ajay",
        description:" ",
        image:"image1.jpg",
        likes:100,
        comments:50,
        views:200 
    },
    {
        id:3,
        name:"ajay",
        description:"story 1",
        image:"image1.jpg",
        likes:100,
        comments:50,
        views:200 
    }]
  return (
    <>
      <div className="container">
        <h1>Stories That Matter</h1>
          <div className="row g-3">
          {stories.map((story) => (
            <div className="col-4 card" key={story.id}>
              <h2>{story.name}</h2>
              <p>{story.description}</p>
               <p>Likes: {story.likes}</p>
              <p>Comments: {story.comments}</p>
              <p>Views: {story.views}</p>
            </div>
          ))}
          </div>
      
      </div>
    </>
  )
}