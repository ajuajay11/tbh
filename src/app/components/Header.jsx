import Image from "next/image";
import img from "./../../../public/tbh.png"

export default function Header() {
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg ">
          <div className="container-fluid">
            <Image src={img} alt="Description" width={90} height={80}/>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent" >
              <ul className="navbar-nav me-auto mb-2 ms-5 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#"> Home </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"> Contact </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown" >
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#"> Something else here </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex">
                <button className="btn btn-outline-success" type="submit"> Search </button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}