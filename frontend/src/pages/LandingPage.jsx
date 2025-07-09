import { useEffect } from "react"
import { FaCloud } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import CLOUDS from 'vanta/dist/vanta.clouds.min'
function LandingPage() {
  useEffect(()=>{
    CLOUDS({
        el:'#backdrop',
        speed:1,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00
    })
  },[])
    return (
    <>
    <div className='min-h-screen bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] '>
      <nav className=" bg-[var(--white-smoke)] h-[60px] flex items-center justify-between px-4 gap-10 ">
        <div className=" flex gap-2 items-center">
          <FaCloud size={'20'}/>
          <div className= ' font-[Nunito] text-[var(--black)] text-2xl font-extrabold '>Atmos</div>
        </div>

        
          <ul className=" flex gap-6 font-bold">
            <li className=" cursor-pointer">Home</li>
            <li className=" cursor-pointer">Features</li>
            <li className=" cursor-pointer">Contact</li>
          </ul>

          <div>
            <button className="bg-gradient-to-tr from-[var(--blue)] to-[var(--white-smoke)] py-2 px-3 rounded-3xl font-bold flex items-center gap-2">Get Started <FaArrowRight/></button>
          </div>
        

      </nav>
    </div>
    
    </>
  )
}

export default LandingPage