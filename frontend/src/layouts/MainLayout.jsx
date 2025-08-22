import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router'

const MainLayout = ({history , setHistory, onClear}) => {
  return (
    <div>
        <Navbar onClear={onClear}/>
        <hr/>
        <Outlet context={{ history, setHistory }}/>
    </div>
  )
}

export default MainLayout